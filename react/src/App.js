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

function App() {
    const [isLoggedIn, setLogIn] = useState(false)
    const [activePage, setActive] = useState('home')
    const [account, updateAccount] = useState({})
    const [balances, updateBalances] = useState({})
    const [initialBalances, updateInitialBalances] = useState({})
    const [stocks, updateStocks] = useState([])
    const [options, updateOptions] = useState([])

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
            let positions = parsePositions(json[0].securitiesAccount.positions)
            updateStocks(positions[0])
            updateOptions(positions[1])
        })
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Header activePage={activePage}
                        setActive={setActive}
                        account={account}
                        balances={balances}
                        initialBalances={initialBalances}
                        isLoggedIn={isLoggedIn}
                        setLogIn={setLogIn}/>
                <div className='body'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/stocks' element={<Stocks stocks={stocks} />} />
                        <Route path='/options' element={<Options options={options}/>} />>
                        <Route path='/crypto' element={<Crypto />} />
                        <Route path='/watch' element={<Watchlist />} />
                        <Route path='/account' element={<Watchlist />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
