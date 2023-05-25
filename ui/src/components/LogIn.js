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

export default function LogIn({isLoggedIn, setLogIn, tdConnected, setTdConnected}) {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [error, setError] = useState('')

    const cookieValue = (val) => document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${val}=`))
        ?.split('=')[1];

    useEffect(() => {
        let jwt = cookieValue("ugly_jwt")
        if (jwt !== undefined) {
            fetch("/auth/login", {method: "GET"})
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

    useEffect(() => {
        tdVerify()
    }, isLoggedIn)

    const tdVerify = () => {
        fetch('/auth/verify_td')
        .then(async response => {
            const hasJson = response.headers.get('content-type')?.includes('application/json')
            const data = hasJson ? await response.json() : null

            if (!response.ok) {
                let error = (data && data.error) || response.status
                return Promise.reject(error)
            }

            console.log(data.valid)
            setTdConnected(data.valid)
            setError(data.error)
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
            {
                isLoggedIn ?
                    <div>
                        Logged in as {username} | <AccountIcon /> | <div id='logout' onClick={() => handleLogout()}>Log Out</div><br/>
                        {
                            tdConnected ?
                                <span id='tdRegister'>Connected to TD Ameritrade</span> :
                                <div id='tdRegister'>Authenticate with TD Ameritrade >> <a href="/auth/td_auth"><button>Connect</button></a></div>
                        }
                    </div> :
            <a href="/auth/login"><button>{"Log in with Google"}</button></a>}
            <p>{error}</p>
        </div>
    )
}