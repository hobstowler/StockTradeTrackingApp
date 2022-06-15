import {useSearchParams, useNavigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    checkAccessCodeExpiry,
    clearCookie,
    fetchAccessToken,
    getCookie,
    refreshAccessToken,
    setCookie
} from "../middleware/misc";
import {BsFillGearFill} from 'react-icons/bs'
import AccountIcon from "./AccountIcon";

export default function LogIn() {
    const [params, setParams] = useSearchParams()
    const navigate = useNavigate()

    const [tdReg, setTdReg] = useState(false)
    const [isLoggedIn, setLogIn] = useState(false)
    const [register, setRegister] = useState(false)
    const [username, setUsername] = useState('Username')
    const [password, setPassword] = useState('Password')
    const [email, setEmail] = useState('Email Address')
    const [apiKey, setApiKey] = useState('API Key')
    const [error, setError] = useState('')

    useEffect(() => {
        let code = params.get('code')
        let access_token = getCookie('access_token')
        let refresh_token = getCookie('refresh_token')

        let app_access_token = getCookie('app_access_token')
        if (app_access_token) {
            fetch('/auth/login', {
                method: 'GET',
                headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + app_access_token}
            })
                .then(response => {
                    if (response.status === 200) {
                        response.json().then(json => {
                            setLogIn(true)
                            setUsername(json.username)
                        })
                    } else if (response.status === 404) {
                        setError('Backend is not connected.')
                    }
                })
                .catch(error => console.log(error))
        }

        if (access_token || refresh_token) {
            setTdReg(true)
        }

        if (code) {
            fetchAccessToken(code)
            navigate('/')
        } else if (refresh_token && !access_token) {
            refreshAccessToken()
        }

        const interval = setInterval(() => {
            checkAccessCodeExpiry()
        }, 1000 * 60 * 1)
    }, [])

    const routeTdReg = () => {
        let app_access_token = getCookie('app_access_token')
        fetch('/auth/get_api_key', {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + app_access_token}
        })
        .then(response => {
            if (response.status === 200) {
                response.json().then(json => {
                    let key = json['api_key']
                    window.location.href = `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https://localhost:8000&client_id=${key}%40AMER.OAUTHAP`
                })
            }
        })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
        .then(response => {
            if (response.status === 200) {
                response.json().then(json => {
                    setLogIn(true)
                    setCookie('app_access_token', json.access_token, 30*24*60*60)
                    setPassword('')
                    setError('')
                })
            } else if (response.status === 401) {
                setError('Invalid username or password')
                setPassword('')
            }
        })
        .catch(error => console.log(error))
    }

    const handleRegistration = (e) => {
        e.preventDefault()
        fetch('/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'username': username,
                'password': password,
                'email': email,
                'API key': apiKey
            })
        })
        .then(response => {
            if (response.status === 201) {
                setLogIn(true)
                response.json().then(json => {
                    setUsername(json.username)
                    setPassword('')
                })
            } else if (response.status === 400) {
                response.json().then(json => {
                    setError(json.detail)
                    setUsername('')
                    setPassword('')
                })
            }
        })
        .catch(error => console.log(error))
    }

    const handleLogout = () => {
        fetch('/auth/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            if (response.status == 200) {
                setLogIn(false)
                clearCookie('app_access_token')
                setUsername('Username')
                setPassword('Password')
                setApiKey('API Key')
            }
        })
    }

    return (
        <div className='logIn'>
            {isLoggedIn ? <div>{tdReg ? undefined : <div id='tdRegister'>The application is not connected to TD Ameritrade >> <button onClick={routeTdReg}>Connect</button></div>}
                    Logged in as {username} | <AccountIcon /> | <div id='logout' onClick={() => handleLogout()}>Log Out</div></div> :
            <form onSubmit={register ? handleRegistration : handleLogin}>
                <input type='text' value={username} onFocus={() => {
                        if (username === 'Username') {setUsername('')}
                    }} onBlur={() => {
                        if (username === '') {setUsername('Username')}
                    }} onChange={(e) => setUsername(e.target.value)}/>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                {!register ? undefined :
                    <input type='email' value={email} onFocus={() => {
                            if (email === 'Email Address') {setEmail('')}
                        }} onBlur={() => {
                            if (email === '') {setEmail('Email Address')}
                        }} onChange={(e) => setEmail(e.target.value)} />}
                {!register ? undefined :
                    <input type='text' value={apiKey} onFocus={() => {
                            if (apiKey === 'API Key') {setApiKey('')}
                        }} onBlur={() => {
                            if (apiKey === '') {setApiKey('API Key')}
                        }} onChange={(e) => setApiKey(e.target.value)}/>
                }
                <button type='submit'>{register ? "Register" : "Log In"}</button>
                {register ? <div id='register' onClick={() => setRegister(false)}>Cancel</div> : <div id='register' onClick={() => setRegister(true)}>Register</div>}
            </form>}
            <p>{error}</p>
        </div>
    )
}