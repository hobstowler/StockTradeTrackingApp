import requests
import os


def get_companies(event, context):
    tradier_prod_token = os.environ.get('TRADIER_PROD_ACCESS_TOKEN')
    tradier_endpoint = os.environ.get('TRADIER_PROD_ENDPOINT')

    query = event['queryStringParameters'].get('q')

    r = requests.get(
        f'{tradier_endpoint}/v1/markets/search?q={query}',
        headers={'Authorization': f'Bearer {tradier_prod_token}', 'Accept': 'application/json'})

    return {
        "statusCode": r.status_code,
        "body": r.content,
    }