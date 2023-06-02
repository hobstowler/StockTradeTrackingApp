import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Footer from "./components/Footer";
import Watchlist from "./pages/Watchlist";
import {useEffect, useState} from "react";
import Stocks from "./pages/Stocks";
import Options from "./pages/Options";
import Crypto from "./pages/Crypto";
import {getAccounts, getAccountPositions, getFullAccount, parsePositions} from "./middleware/accounts";
import {checkAccessCodeExpiry} from "./middleware/misc";
import Account from "./pages/Account";
import LogIn from "./components/LogIn";
import Balances from "./components/Balances";
import Insight from "./pages/Insight";

function App() {
    const [isLoggedIn, setLogIn] = useState(false)
    const [tdConnected, setTdConnected] = useState(false)

    const [activePage, setActive] = useState('home')
    const [accounts, updateAccounts] = useState([])
    const [activeAccount, setActiveAccount] = useState({})
    const [activePositions, updateActivePositions] = useState([])
    const [openOrders, updateOpenOrders] = useState([])
    const [activeAccountOverride, setActiveAccountOverride] = useState(false)
    const [currentBalances, setCurrentBalances] = useState({})
    const [balances, updateBalances] = useState({})
    const [initialBalances, updateInitialBalances] = useState({})

    useEffect(() => {
        getAccount()
        const interval = setInterval(() => {
            getAccount()
        }, 1000 * 60 * 5)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (activeAccount === undefined) {
            updateActivePositions([])
            updateOpenOrders([])
            return
        }

        if (activeAccount.positions !== undefined) {
            updateActivePositions(activeAccount.positions || undefined)
        }
        if (activeAccount.orderStrategies !== undefined) {
            updateOpenOrders(activeAccount.orderStrategies || undefined)
        }
    }, [activeAccount])

    const getAccount = () => {
        fetch('/account/')
        .then(async response => {
            const hasJson = response.headers.get('content-type')?.includes('application/json')
            const data = hasJson ? await response.json() : null

            if (!response.ok) {
                let error = (data && data.error) || response.status
                return Promise.reject(error)
            }

            updateAccounts(data)
            if (activeAccountOverride === false) {
                setActiveAccount(data[0].securitiesAccount)
            }
        })
    }

    const changeActiveAccount = (accountId) => {

    }

    const disconnect = () => {
        fetch('/auth/disconnect', {
            method: 'POST'
        })
          .then(response => {
              if (response.status === 302 || response.status === 200) {
                  setTdConnected(false)
                  // TODO other logout-related tasks
              }
          })
    }

    return (
        <div className="App">
            <BrowserRouter>
                <LogIn activeAccount={activeAccount}
                       changeActiveAccount={changeActiveAccount}
                       isLoggedIn={isLoggedIn}
                       setLogIn={setLogIn}
                       tdConnected={tdConnected}
                       setTdConnected={setTdConnected}
                       disconnect={disconnect} />
                <Header activePage={activePage}/>
                <Balances balances={activeAccount.currentBalances}
                          initialBalances={activeAccount.initialBalances}/>
                <div className='body'>
                    <Routes>
                        <Route path='/' element={<Home setActive={setActive} positions={activePositions} openOrders={openOrders} />} />
                        <Route path='/stocks' element={<Stocks positions={activePositions} activeAccount={activeAccount} openOrders={openOrders} setActive={setActive} />} />
                        <Route path='/options' element={<Options positions={activePositions} openOrders={openOrders} setActive={setActive} />} />>
                        <Route path='/crypto' element={<Crypto setActive={setActive} />} />
                        <Route path='/watch' element={<Watchlist setActive={setActive} />} />
                        <Route path='/account' element={<Account setActive={setActive} />} />
                        <Route path='/insight' element={<Insight setActive={setActive} />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
