import os

import requests


def get_quotes(event, context):
    tradier_prod_token = os.environ.get('TRADIER_PROD_ACCESS_TOKEN')
    tradier_endpoint = os.environ.get('TRADIER_PROD_ENDPOINT')

    query = event['queryStringParameters'].get('q')
    greeks = event['queryStringParameters'].get('greeks')

    r = requests.get(
        f'{tradier_endpoint}/v1/markets/quotes?symbols={query}{"&greeks=true" if greeks else ""}',
        headers={'Authorization': f'Bearer {tradier_prod_token}', 'Accept': 'application/json'})

    # return HttpResponse(r.content, status=r.status_code, content_type='application/json')

    return {
        'statusCode': r.status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': r.content,
    }
