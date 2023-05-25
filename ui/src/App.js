import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer";
import Watchlist from "./pages/Watchlist";
import {useEffect, useState} from "react";
import Stocks from "./pages/Stocks";
import Options from "./pages/Options";
import Crypto from "./pages/Crypto";
import {getAccounts, getAccountPositions, getFullAccount, parsePositions} from "./middleware/accounts";
import {checkAccessCodeExpiry} from "./middleware/misc";
import Account from "./pages/Account";

function App() {
    const [isLoggedIn, setLogIn] = useState(false)
    const [tdConnected, setTdConnected] = useState(false)

    const [activePage, setActive] = useState('home')
    const [accounts, updateAccounts] = useState([])
    const [activeAccount, setActiveAccount] = useState({})
    const [activeAccountOverride, setActiveAccountOverride] = useState(false)
    const [currentBalances, setCurrentBalances] = useState({})
    const [balances, updateBalances] = useState({})
    const [initialBalances, updateInitialBalances] = useState({})
    const [positions, updatePositions] = useState({})
    const [openOrders, updateOpenOrders] = useState([])

    useEffect(() => {
        getAccount()
        const interval = setInterval(() => {
            getAccount()
        }, 1000 * 60 * 5)

        return () => clearInterval(interval)
    }, [])

    const getAccount = () => {
        fetch('/account/')
        .then(async response => {
            const hasJson = response.headers.get('content-type')?.includes('application/json')
            const data = hasJson ? await response.json() : null

            if (!response.ok) {
                let error = (data && data.error) || response.status
                return Promise.reject(error)
            }

            console.log(data[0].securitiesAccount)
            updateAccounts(data)
            if (activeAccountOverride === false) {
                setActiveAccount(data[0].securitiesAccount)
            }
        })
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Header activePage={activePage}
                        account={activeAccount}
                        balances={activeAccount.currentBalances}
                        initialBalances={activeAccount.initialBalances}
                        isLoggedIn={isLoggedIn}
                        setLogIn={setLogIn}
                        tdConnected={tdConnected}
                        setTdConnected={setTdConnected}/>
                <div className='body'>
                    <Routes>
                        <Route path='/' element={<Home setActive={setActive} positions={positions} openOrders={openOrders} />} />
                        <Route path='/stocks' element={<Stocks stocks={positions.stocks} openOrders={openOrders} setActive={setActive} />} />
                        <Route path='/options' element={<Options options={positions.options} openOrders={openOrders} setActive={setActive} />} />>
                        <Route path='/crypto' element={<Crypto setActive={setActive} />} />
                        <Route path='/watch' element={<Watchlist setActive={setActive} />} />
                        <Route path='/account' element={<Account setActive={setActive} />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
