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
import Cookies from "js-cookie"

export default function LogIn({isLoggedIn, setLogIn}) {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [tdReg, setTdReg] = useState(false)
    const [error, setError] = useState('')

    const cookieValue = (val) => document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${val}=`))
        ?.split('=')[1];

    useEffect(() => {
        let jwt = cookieValue("ugly_jwt")
        if (jwt !== undefined) {
            fetch("/auth/login", {
                method: "GET"})
                .then(async response => {
                    const hasJson = response.headers.get('content-type')?.includes('application/json')
                    const data = hasJson ? await response.json() : null

                    if (!response.ok) {
                        let error = (data && data.error) || response.status
                        return Promise.reject(error)
                    }

                    setLogIn(data.loggedIn)
                    setUsername(data.username)
                })
        }
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
    }

    const handleLogout = () => {
        fetch('/auth/logout', {
            method: 'POST'
        })
        .then(response => {
            if (response.status === 200) {
                setLogIn(false)
                setUsername('Username')
                navigate('/loggedOut')
            }
        })
    }

    return (
        <div className='logIn'>
            {isLoggedIn ? <div>{tdReg ? undefined : <div id='tdRegister'>Authenticate with TD Ameritrade >> <a href="/auth/td_auth"><button>Connect</button></a></div>}
                    Logged in as {username} | <AccountIcon /> | <div id='logout' onClick={() => handleLogout()}>Log Out</div></div> :
            <a href="/auth/login"><button>{"Log in with Google"}</button></a>}
            <p>{error}</p>
        </div>
    )
}