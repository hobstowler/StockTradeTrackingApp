'use strict'

export function setCookie(name, value, seconds_to_expire)
{
    let date = new Date();
    date.setTime(Date.now() + (seconds_to_expire*1000))
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    document.cookie = `${name}_expiry=${date.toUTCString()};${expires};path=/`
}

export function getAuthCode()
{
    let name = "authCode";
    return getCookie(name);
}

export function getCookie(cname)
{
    let name = cname + "=";
    let ca = decodeURIComponent(document.cookie).split(";");
    for (let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        c = c.trim();
        if (c.indexOf(name) === 0)
        {
            return c.substring(name.length, c.length+1);
        }
    }
    return "";
}

export function clearCookie(cname)
{
    setCookie(cname,"",-1);
}

export function parseAccessCode(response)
{
    // absolutely no idea why it must be multiplied by 500
    setCookie("access_token",response.access_token, response.expires_in)
    if (response.refresh_token) {
        setCookie("refresh_token", response.refresh_token, response.refresh_token_expires_in)
    }
    return response.access_token
}

export function fetchAccessToken(code)
{
    code = encodeURIComponent(code)
    let access_token = getCookie('app_access_token')
    fetch('/auth/get_api_key', {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + access_token}
    })
    .then(response => {
        if (response.status === 200) {
            response.json().then(json => {
                let api_key = json['api_key']
                let reqbody = "grant_type=authorization_code&" +
                    "refresh_token=&" +
                    "access_type=offline&" +
                    "code=" + code + "&" +
                    "client_id=" + api_key + "&" +
                    "redirect_uri=https://localhost:8000"
                const req_options = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: reqbody
                }
                fetch("https://api.tdameritrade.com/v1/oauth2/token", req_options)
                .then(response => {
                    if (response.status === 200) {
                        return response.json()
                    }
                    else {
                        throw new Error("Bad Response from Server.")
                    }
                })
                .then(response => parseAccessCode(response))
                .catch(error => console.log(error))
            })

        }
    })
    .catch(error => console.log(error))
}

export function refreshAccessToken()
{
    let refresh_token = getCookie('refresh_token')
    if (refresh_token === '') {
        return undefined
    }

    let access_token = getCookie('app_access_token')
    fetch('/auth/get_api_key', {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token}
    })
    .then(response => {
        if (response.status === 200) {
            response.json().then(json => {
                let api_key = json['api_key']
                let refresh_token = encodeURIComponent(getCookie('refresh_token'))
                let body = "grant_type=refresh_token&" +
                    "refresh_token=" + refresh_token + "&" +
                    "access_type=&" +
                    "code=&" +
                    "client_id=" + api_key + "&" +
                    "redirect_uri=https://localhost:8000"
                const req_options = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: body
                }
                fetch("https://api.tdameritrade.com/v1/oauth2/token", req_options)
                .then(response => {
                    if (response.status === 200) {
                        response.json()
                        .then(json => {
                            parseAccessCode(json)
                        })
                    }
                    else {
                        throw new Error("Bad Response from Server.")
                    }
                })
            })
        }
    })
    .catch(error => console.log(error))
}

export function checkAccessCodeExpiry() {
    let accessTokenExpiry = getCookie('access_token_expiry')
    let date = new Date(accessTokenExpiry)
    let delta = (date - Date.now()) / 60 / 1000
    console.log(`checking... time until expiration: ${delta} minutes`)
    if (delta <= 5.0) {
        console.log('refreshing')
        let result = refreshAccessToken()
        if (result === undefined) {
            return {'refesh_expired': 1}
        }
        console.log('successfully refreshed')
    }
    return {'refresh_expired': 0}
}