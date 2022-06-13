from flask import Flask, request, redirect, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os

import account
import auth
import db


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'users.sqlite'),
    )
    app.config['JWT_SECRET_KEY'] = 'dev'
    #app.config['SQALCHEMY_DATABASE_URI']
    jwt = JWTManager(app)

    with app.app_context():
        db.init_app(app)
        app.register_blueprint(auth.auth)
        app.register_blueprint(account.account)
        #db.init_db()

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/authcode', methods=['GET'])
    def home():  # put application's code here
        code = request.args.get('code')
        print(code)

        return jsonify({'msg': 'Welcome Home!'})

    @app.route('/stocks', methods=['POST', 'GET', 'PUT'])
    def stocks():
        if request.method == 'GET':
            if request.json:
                # get requested stock
                pass
            else:
                # get everything
                pass
        elif request.method == 'POST':
            # place new stock order
            pass
        elif request.method == 'PUT':
            # update stock order? like sell something maybe.
            pass

    @app.route('/options', methods=['POST', 'GET', 'PUT'])
    def options():
        if request.method == 'GET':
            if request.content_type == 'application/json':
                # get requested stock
                pass
            else:
                # get everything
                pass
        elif request.method == 'POST':
            # place new stock order
            pass
        elif request.method == 'PUT':
            # update stock order? like sell something maybe.
            pass

    @app.route('/crypto', methods=['POST', 'GET', 'PUT'])
    def crypto():
        if request.method == 'GET':
            if request.content_type == 'application/json':
                # get requested stock
                pass
            else:
                # get everything
                pass
        elif request.method == 'POST':
            # place new stock order
            pass
        elif request.method == 'PUT':
            # update stock order? like sell something maybe.
            pass
        return 'hello'

    @app.route('/market-open', methods=['GET'])
    def market_open():
        return jsonify({'msg': 'not implemented yet'}), 204


    return app


if __name__ == '__main__':
    app = create_app()
    print('hello')