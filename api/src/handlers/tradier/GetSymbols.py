import os

import requests


def get_symbols(event, context):
    tradier_prod_token = os.environ.get('TRADIER_PROD_ACCESS_TOKEN')
    tradier_endpoint = os.environ.get('TRADIER_PROD_ENDPOINT')

    query = event['queryStringParameters'].get('q')
    security_type = event['pathParameters'].get('security_type')

    r = requests.get(
        f'{tradier_endpoint}/v1/markets/lookup?q={query}{"&types=" + security_type if security_type else ""}',
        headers={'Authorization': f'Bearer {tradier_prod_token}', 'Accept': 'application/json'})

    return {
        "statusCode": r.status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*'
        },
        "body": r.content,
    }
