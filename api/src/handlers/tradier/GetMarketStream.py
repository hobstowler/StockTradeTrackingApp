import requests
import os


def get_market_stream(event, context):
    tradier_prod_token = os.environ.get('TRADIER_PROD_ACCESS_TOKEN')
    tradier_endpoint = os.environ.get('TRADIER_PROD_ENDPOINT')

    r = requests.post(
        f'{tradier_endpoint}/v1/markets/events/session',
        headers={
            'Authorization': f'Bearer {tradier_prod_token}',
            'Accept': 'application/json'
        }
    )

    return {
        'statusCode': r.status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': r.content
    }
