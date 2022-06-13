'use strict'

import {getCookie, refreshAccessToken} from "./misc";

const ACCOUNT_URL ='https://api.tdameritrade.com/v1/accounts'

export function getAccountBalances() {
    console.log('bal')
    let access_token = getCookie('access_token')

    return fetch(ACCOUNT_URL, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
}