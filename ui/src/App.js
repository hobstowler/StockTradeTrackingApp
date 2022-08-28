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
    const [activePage, setActive] = useState('home')
    const [account, updateAccount] = useState({})
    const [balances, updateBalances] = useState({})
    const [initialBalances, updateInitialBalances] = useState({})
    const [positions, updatePositions] = useState({
        stocks: {
            longStocks: [],
            shortStocks: []
        },
        options: {
            longOptions: [],
            shortOptions: []
        }
    })
    const [openOrders, updateOpenOrders] = useState([])

    useEffect(() => {
        checkAccessCodeExpiry()
        getAccount()
        //getPositions()
        const interval = setInterval(() => {
            getAccount()
            //getPositions()
        }, 1000 * 60 * 5)
        return () => clearInterval(interval)
    }, [])

    const getAccount = () => {
        getFullAccount()
        .then(response => response.json())
        .then(json => {
            console.log(json[0])
            updateAccount(json[0])
            updateBalances(json[0].securitiesAccount.currentBalances)
            updateInitialBalances(json[0].securitiesAccount.initialBalances)
            updatePositions(parsePositions(json[0].securitiesAccount.positions))
            console.log(json[0].securitiesAccount.orderStrategies)
            updateOpenOrders(json[0].securitiesAccount.orderStrategies)
        })
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Header activePage={activePage}
                        account={account}
                        balances={balances}
                        initialBalances={initialBalances}
                        isLoggedIn={isLoggedIn}
                        setLogIn={setLogIn}/>
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
