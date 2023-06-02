import {useSearchParams, useNavigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";
import AccountIcon from "./AccountIcon";

export default function LogIn({activeAccount, changeActiveAccount, isLoggedIn, setLogIn, tdConnected, setTdConnected, disconnect}) {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [error, setError] = useState('')

    const cookieValue = (val) => document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${val}=`))
        ?.split('=')[1];

    useEffect(() => {
        if (cookieValue("ugly_jwt") !== undefined) {
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
    }, [isLoggedIn])

    const tdVerify = () => {
        fetch('/auth/verify_td')
        .then(async response => {
            const hasJson = response.headers.get('content-type')?.includes('application/json')
            const data = hasJson ? await response.json() : null

            if (!response.ok) {
                let error = (data && data.error) || response.status
                return Promise.reject(error)
            }

            setTdConnected(data.valid)
            setError(data.error)
        })
    }

    const handleLogout = () => {
        fetch('/auth/logout', {method: 'POST'})
        .then(response => {
            if (response.status === 200) {
                setLogIn(false)
                setUsername('')
                navigate('/loggedOut')
            }
        })
    }

    const settingScrollOut = () => {
        // TODO
    }

    return (
        <div className='wrapper'>
            <div className='logIn'>
                {
                    isLoggedIn ?
                        <div>
                            Logged in as {username} | <div className='accountSettings'><AccountIcon /></div> | <div id='logout' onClick={() => handleLogout()}>Log Out</div><br/>
                            {
                                tdConnected ?
                                    <div>
                                        <div id='tdRegister'>Connected to TD Ameritrade | <span id='tdDisconnect' onClick={disconnect}>Disconnect</span></div>
                                        <div>Active Account: {activeAccount !== undefined ? activeAccount.accountId : ''}</div>
                                    </div> :
                                    <div id='tdRegister'>Authenticate with TD Ameritrade >> <a href="/auth/td_auth"><button>Connect</button></a></div>
                            }
                        </div> :
                <a href="/auth/login"><button>{"Log in with Google"}</button></a>}
                <p>{error}</p>
            </div>
        </div>
    )
}