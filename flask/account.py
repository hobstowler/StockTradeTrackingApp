import requests
import asyncio
from flask import Blueprint, request, jsonify

account = Blueprint('account', __name__, url_prefix='/account')

@account.route('/', methods=['GET'])
def get_account():
    pass

@account.route('/balances', methods=['GET'])
async def get_balances():
    access_code = request.headers.get('Authorization')
    url = 'https://api.tdameritrade.com/v1/accounts'
    response = await requests.get(url, headers={'Authorization': access_code})
    return jsonify(response)
