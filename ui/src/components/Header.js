import Navigation from "./Navigation";
import LogIn from "./LogIn";
import Balances from "./Balances";
import {useState} from "react";

export default function Header({activePage, account, balances}) {
    const [showBalance, setShowBalance] = useState(true)

    return (
        <div className='wrapper' id='headWrapper'>
            <div className='header'>
                <div className='headTitle'>
                    <h1>The Ugly Trading App</h1>
                    <h2>Powered by Stunning. Good. Looks.</h2>
                </div>
                <Navigation activePage={activePage} />
            </div>
        </div>
    )
}