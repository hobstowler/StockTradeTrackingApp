import json
import os

import requests


def get_auth_token(event, context):
    app_key = os.environ.get('SCHWAB_APP_KEY')
    app_secret = os.environ.get('SCHWAB_APP_SECRET')
    base_url = os.environ.get('SCHWAB_API_BASE_URL')
    code = event['queryStringParameters'].get('code')

    r = requests.post(
        f'{base_url}/oauth/token',
        data=json.dumps({
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "https://127.0.0.1:3000",
            "client_id": app_key,
            "client_secret": app_secret,
            "scope": "readonly"
        })
    )

    return {
        "statusCode": 200,
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': r.content
    }
