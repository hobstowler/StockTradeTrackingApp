'use strict'

export function setCookie(name, value, seconds_to_expire)
{
    let date = new Date(Date.now() + (seconds_to_expire*1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
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
    console.log('parsing')
    // absolutely no idea why it must be multiplied by 500
    setCookie("access_token",response.access_token, response.expires_in)
    console.log(response.expires_in)
    if (response.refresh_token) {
        setCookie("refresh_token", response.refresh_token, response.refresh_token_expires_in)
        console.log(response.refresh_token_expires_in)
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

export async function refreshAccessToken()
{
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
                return fetch("https://api.tdameritrade.com/v1/oauth2/token", req_options)
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