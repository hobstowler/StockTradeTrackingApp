import json
import os


def get_auth_url(event, context):
    # TODO add state variable
    app_key = os.environ.get('SCHWAB_APP_KEY')
    base_url = os.environ.get('SCHWAB_API_BASE_URL')

    callback = f"https://127.0.0.1:3000"

    return {
        "statusCode": 200,
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': json.dumps({'url': f'{base_url}/oauth/authorize?response_type=code&client_id={app_key}&redirect_uri={callback}&provider=schwab'})
    }
