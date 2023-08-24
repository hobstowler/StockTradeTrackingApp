import './App.css';
import Home from "./Home";
import Header from "./shared/components/Header";

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Footer from "./shared/components/Footer";
import {default as Watch} from "./watch";
import {useEffect, useState} from "react";
import {default as Stocks} from "./stock";
import {default as Options} from "./options";
import {default as Crypto} from "./crypto";
import {default as Insights} from "./insights";
import {default as Account} from "./account";
import {default as Authentication} from "./authentication";
import LogIn from "./authentication/components/LogIn";
import Balances from "./account/components/Balances";
import Callback from "./authentication/components/Callback";

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
    <BrowserRouter>
      <LogIn/>
      <Header/>
      <Balances/>

      <Routes>
        <Route path='/' element={<Home positions={activePositions} openOrders={openOrders}/>}/>
        <Route path='/stocks'
               element={<Stocks positions={activePositions} activeAccount={activeAccount} openOrders={openOrders}/>}/>
        <Route path='/options'
               element={<Options positions={activePositions} openOrders={openOrders}/>}/>>
        <Route path='/crypto' element={<Crypto/>}/>
        <Route path='/watch' element={<Watch/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/insight' element={<Insights/>}/>
        <Route path='/login' element={<Authentication login />} />
        <Route path='/register'>
          <Route path='' element={<Authentication />} />
          <Route path='confirm/:data' element={<Callback />} />
        </Route>
      </Routes>

      <Footer/>
    </BrowserRouter>
  );
}

export default App;
