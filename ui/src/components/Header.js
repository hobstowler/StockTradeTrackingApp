import Navigation from "./Navigation";
import LogIn from "./LogIn";
import Balances from "./Balances";
import {useState} from "react";

export default function Header({activePage, setActive}) {
    const [showBalance, setShowBalance] = useState(true)

    return (
        <div className='header'>
            <div className='headSplash' id='splashTop'></div>
            <LogIn />
            <div className='headMain'>
                <div>
                    <div className='headTitle'>
                        <h1>The Ugly Trading App</h1>
                        <h2>Powered by TD Ameritrade</h2>
                    </div>
                    <Navigation activePage={activePage} setActive={setActive}/>
                </div>
            </div>
            {showBalance ? <Balances /> : undefined}
            <div className='headSplash' id='splashBottom' onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? "- Collapse -" : "- Expand -"}
            </div>
        </div>
    )
}