import requests
import os


def get_option_chains(event, context):
    tradier_prod_token = os.environ.get('TRADIER_PROD_ACCESS_TOKEN')
    tradier_endpoint = os.environ.get('TRADIER_PROD_ENDPOINT')

    symbol = event['queryStringParameters'].get('symbol')

    r = requests.get(
        f'{tradier_endpoint}/v1/markets/options/chains?symbol={symbol}&greeks=true',
        headers={'Authorization': f'Bearer {tradier_prod_token}', 'Accept': 'application/json'})

    return {
        "statusCode": r.status_code,
        "body": r.content,
    }
