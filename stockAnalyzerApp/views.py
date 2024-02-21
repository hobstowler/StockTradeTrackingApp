import os
import json
import requests

from tradetracker.settings import TRADIER_PROD_ENDPOINT, PROD_ACCESS_TOKEN

from django.http import HttpResponse


def clock(request):
    r = requests.get(
        f'{TRADIER_PROD_ENDPOINT}/v1/markets/clock',
        headers={'Authorization': f'Bearer {PROD_ACCESS_TOKEN}', 'Accept': 'application/json'})

    return HttpResponse(r.content, status=r.status_code, content_type='application/json')


def symbol_lookup(request, security_type=None):
    query = request.GET['q']

    r = requests.get(
        f'{TRADIER_PROD_ENDPOINT}/v1/markets/lookup?q={query}{"&types=" + security_type if security_type else ""}',
        headers={'Authorization': f'Bearer {PROD_ACCESS_TOKEN}', 'Accept': 'application/json'})

    return HttpResponse(r.content, status=r.status_code, content_type='application/json')

def symbol_search(request):
    query = request.GET['q']
    greeks = request.GET['greeks']

    r = requests.get(
        f'{TRADIER_PROD_ENDPOINT}/v1/markets/quotes?symbols={query}{"&greeks=true" if greeks else ""}',
        headers={'Authorization': f'Bearer {PROD_ACCESS_TOKEN}', 'Accept': 'application/json'})

    return HttpResponse(r.content, status=r.status_code, content_type='application/json')

