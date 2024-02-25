import json
import os
import requests


def get_clock(event, context):
    tradier_prod_token = os.environ.get('TRADIER_PROD_ACCESS_TOKEN')
    tradier_endpoint = os.environ.get('TRADIER_PROD_ENDPOINT')

    r = requests.get(
        f'{tradier_endpoint}/v1/markets/clock',
        headers={'Authorization': f'Bearer {tradier_prod_token}', 'Accept': 'application/json'})

    return {
        "statusCode": r.status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
        "body": r.content,
    }
