import json
import os
import jwt
import logging

logger = logging.getLogger()
logger.setLevel('INFO')


def authenticate_with_supabase(event, context):
    token = event['authorizationToken'].split()[1]
    jwt_secret = os.environ.get('SUPABASE_JWT_SECRET')
    effect = 'Deny'
    decoded = None

    if token is not None:
        try:
            decoded = jwt.decode(token, jwt_secret, audience='authenticated', algorithms=['HS256'])
        except jwt.ExpiredSignatureError as e:
            logger.setLevel('ERROR')
            logger.error(e)
        else:
            effect = 'Allow'

    return {
        'principalId': decoded['sub'] if decoded is not None else '',
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': event['methodArn']
                }
            ]
        },
        'context': {
            'sub': decoded['sub'],
            'email': decoded['email']
        }
    }
