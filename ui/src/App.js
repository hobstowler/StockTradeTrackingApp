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
import ReturnAuth from "./authentication/components/ReturnAuth";
import {useDispatch, useSelector} from "react-redux";
import {loadAccounts, loadAccountTransactions} from "./account/actions";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(({authentication}) => authentication?.user)
  const status = useSelector(({authentication}) => authentication?.status)
  const isLoggedIn = status?.isLoggedIn
  const isConnected = status?.isConnected

  const account = useSelector(({account}) => account)
  const activeAccount = account?.activeAccount

  useEffect(() => {
    if (!isConnected) {
      return
    }

    dispatch(loadAccounts())
  }, [isConnected])

  // useEffect(() => {
  //   if (activeAccount?.securitiesAccount) {
  //     dispatch(loadAccountTransactions(activeAccount.securitiesAccount.accountId))
  //   }
  // }, [activeAccount])

  return (
    <BrowserRouter>
      <LogIn/>
      <Header/>
      <Balances/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/stocks'
               element={<Stocks/>}/>
        <Route path='/options'
               element={<Options/>}/>
        <Route path='/crypto' element={<Crypto/>}/>
        <Route path='/watch' element={<Watch/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/insight' element={<Insights/>}/>
        <Route path='/login' element={<Authentication login />} />
        <Route path='/register'>
          <Route path='' element={<Authentication />} />
          <Route path='confirm/:data' element={<Callback />} />
        </Route>
        <Route path='/auth'>
          <Route path='td_return_auth' element={<ReturnAuth provider='td'/>}/>
          <Route path='google_return_auth' element={<ReturnAuth provider='google'/>}/>
        </Route>
      </Routes>

      <Footer/>
    </BrowserRouter>
  );
}

export default App;
