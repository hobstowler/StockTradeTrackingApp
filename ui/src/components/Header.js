import Navigation from "./Navigation";
import LogIn from "./LogIn";
import Balances from "./Balances";
import {useEffect, useState} from "react";

export default function Header({isLoggedIn, setLogIn, activePage, account, balances}) {
    const [showBalance, setShowBalance] = useState(true)

    return (
        <div className='header'>
            <div className='headSplash' id='splashTop'></div>
            <LogIn isLoggedIn={isLoggedIn} setLogIn={setLogIn}/>
            <div className='headMain'>
                <div>
                    <div className='headTitle'>
                        <h1>The Ugly Trading App</h1>
                        <h2>Powered by Stunning Good Looks</h2>
                    </div>
                    <Navigation activePage={activePage} />
                </div>
            </div>
            {showBalance && account !== undefined ? <Balances balances={balances} /> : undefined}
            <div className='headSplash' id='splashBottom' onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? "- Collapse -" : "- Expand -"}
            </div>
        </div>
    )
}