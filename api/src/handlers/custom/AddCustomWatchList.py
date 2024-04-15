def add_custom_watchlist(event, context):
    sub = event.pathParameters.get('sub', 0)
    name = event.pathParameters.get('name', None)

    if name is None:
        return {'statusCode': 400}



    return {
        "statusCode": 201,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
    }
