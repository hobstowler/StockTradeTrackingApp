def add_to_custom_watchlist(event, context):
    return {
        "statusCode": 201,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET'
        },
    }