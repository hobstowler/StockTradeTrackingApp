# Author: Hobs Towler
# Date: 2/23/2022
# Description:
import datetime
import typing
import requests
import functools, json
from sqlite3.dbapi2 import IntegrityError

from flask_jwt_extended import create_access_token, current_user, jwt_required, get_jwt_identity, JWTManager, \
    unset_jwt_cookies
from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for, Response, jsonify)
from werkzeug.security import check_password_hash, generate_password_hash

from db import *

auth = Blueprint('auth', __name__, url_prefix='/auth')


"""#####################################################################################################################
#
#  USER REGISTRATION AND LOGIN HANDLING METHODS
#
#####################################################################################################################"""


@auth.route('/register', methods=['POST'])
def register():
    """
    Registers a new user to the database. If the user already exists in the database, raises an IntegrityError.

    :return: Response object containing success or error message.

    :raises: IntegrityError
        Raised if user attempting to be added already exists in the database.
    """
    req = request.get_json()
    username = req['username']
    password = req['password']
    email = req['email']
    api_key = req['API key']

    db = get_db()
    error = None

    if not username or username.lower() in ['username', 'test']:
        error = 'Username is missing or invalid.'
    elif not password or password.lower() in ['password', 'test']:
        error = 'Password is missing or invalid.'
    elif not api_key:
        error = 'API Key is missing.'

    if not email:
        email = ''

    if error:
        return jsonify(error), 400

    try:
        user = db.execute('SELECT * FROM user WHERE username = ?', (username,)).fetchone()
        if user:
            raise IntegrityError("user already registered")
        else:
            db.execute(
                "INSERT INTO user (username, password, api_key, email, authcode) VALUES (?, ?, ?, ?, ?)",
                (username, generate_password_hash(password), api_key, email, "None"),
            )
            db.commit()
            reply = {'message': 'User has been successfully registered.'}
            return jsonify(reply), 201
    except IntegrityError:
        error = f"User {username} is already registered."
        return jsonify({'error': error}), 500


@auth.route('/login', methods=['GET'])
@jwt_required()
def get_cur_user():
    current_user = get_jwt_identity()
    db = get_db()
    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (current_user,)
    ).fetchone()
    if user:
        return jsonify({'username': user['username']}), 200
    return jsonify({'error': 'No user found in database.'}), 401


@auth.route('/login', methods=['POST'])
def login():
    """
    Logs an existing user into the app with provided username and password. Returns an error is the username/password are incorrect or the user does not exist.

    :return: A Response object with error or message indication success or failure of request.
    """
    req = request.get_json()
    username = req['username']
    password = req['password']

    db = get_db()
    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()

    if user is None or not check_password_hash(user['password'], password):
        error = 'Invalid username or password'
        return jsonify({'error': error}), 401

    access_token = create_access_token(identity=user['username'], expires_delta=datetime.timedelta(days=30))
    return jsonify({'access_token': access_token}), 200


@auth.route('/logout', methods=['POST'])
def logout():
    """
    Clears user's session and logs them out.

    :return: A redirect to the log in screen.
    """
    response = jsonify({'msg': 'Log out successful.'})
    unset_jwt_cookies(response)
    return response, 200


@auth.route('/change_password', methods=('GET', 'POST'))
def change_password() -> Response:
    req = request.get_json()
    username = req['username']
    old_password = req['old_password']
    new_password = req['new_password']

    db = get_db()
    error = None

    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        error = 'Username does not exist.'
    elif not check_password_hash(user['password'], old_password):
        error = 'Password does not match'

    if error is None:
        db.execute(
            "UPDATE users SET password = ? WHERE username = ?",
            (generate_password_hash(new_password), username),
        )
        db.commit()
        reply = {
            'message': 'Password successfully updated.'
        }

    if reply is not None:
        return Response(json.dumps(reply), status=200, mimetype='application/json')
    return Response(json.dumps({'error': error}), status=500, mimetype='appliation/json')


###########################################################################################################################################
#
#  TOKEN HANDLING AND TOKEN LIFECYCLE METHODS
#
###########################################################################################################################################
@auth.route('/get_api_key', methods=['GET'])
@jwt_required()
def get_api_key() -> str:
    username = get_jwt_identity()
    db = get_db()
    api_key = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()['api_key']
    return jsonify({'api_key': api_key}), 200

@auth.route('/get_access', methods=['GET'])
@jwt_required()
def get_access_token():
    authCode = request.args.get('code')
    api_key = get_api_key()

    url = 'https://api.tdameritrade.com/v1/oauth2/token'
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        'grant_type': 'authorization_code',
        'refresh_token': '',
        'access_type': 'offline',
        'code': authCode,
        'client_id': api_key,
        'redirect_uri': 'https://localhost:8000'
    }

    response = requests.post(url, headers=headers, data=data)


