'use strict'

import {getCookie} from "./misc";

const ACCOUNT_URL ='https://api.tdameritrade.com/v1/accounts'

export function getAccounts() {
    let access_token = getCookie('access_token')

    return fetch(ACCOUNT_URL, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
}

export function getAccountOrders() {
    let access_token = getCookie('access_token')

    return fetch(ACCOUNT_URL + '?fields=orders', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
}

export function getAccountPositions() {
    let access_token = getCookie('access_token')

    return fetch(ACCOUNT_URL + '?fields=positions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
}

export function getFullAccount() {
    let access_token = getCookie('access_token')

    return fetch(ACCOUNT_URL + '?fields=positions,orders', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
}

export function parsePositions(positions) {
    let longStocks = []
    let shortStocks = []
    let longOptions = []
    let shortOptions = []

    for (let i = 0; i < positions.length; i++) {
        let type = positions[i].instrument.assetType
        if (type === 'EQUITY') {
            if (positions[i].longQuantity !== 0) {
                longStocks.push(positions[i])
            }
            if (positions[i].shortQuantity !== 0) {
                shortStocks.push(positions[i])
            }
        } else if (type === 'OPTION') {
            if (positions[i].longQuantity !== 0) {
                longOptions.push(positions[i])
            }
            if (positions[i].shortQuantity !== 0) {
                shortOptions.push(positions[i])
            }
        }
    }
    return {
        stocks: {
            longStocks: longStocks,
            shortStocks: shortStocks
        },
        options: {
            longOptions: longOptions,
            shortOptions: shortOptions
        }
    }
}