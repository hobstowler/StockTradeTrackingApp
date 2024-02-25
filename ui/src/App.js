import './App.css';
import Home from "./Home";
import Header from "./shared/components/Header";

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Footer from "./shared/components/Footer";
import {default as Watch} from "./watch";
import React, {useEffect, useState} from "react";
import {default as Stocks} from "./stock";
import {default as Options} from "./options";
import {default as Crypto} from "./crypto";
import {default as Insights} from "./insights";
import {default as Account} from "./account";
import AccountHeader from "./authentication/components/AccountHeader";
import {useDispatch} from "react-redux";
import MarketStatus from "./shared/components/MarketStatus";
import {createClient} from "@supabase/supabase-js";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {Auth} from "@supabase/auth-ui-react";
import {setSession} from "./authentication/actions";
import Authenticator from "./authentication/components/Authenticator";

const PROJECT_URL = process.env.REACT_APP_SUPABASE_PROJECT_URL
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY

const supabase = createClient(PROJECT_URL, API_KEY)

const App = () => {
  const [displayLogin, setDisplayLogin] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: {session}}) => {
      dispatch(setSession(session))
    })

    const {data: {subscription},} = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = () => {
    setDisplayLogin(true)
  }

  const logout = () => {
    supabase.auth.signOut({scope: 'local'})
  }

  return (
    <BrowserRouter>
      <Authenticator
        displayLogin={displayLogin}
        setDisplayLogin={setDisplayLogin}
        auth={
          <Auth
            supabaseClient={supabase}
            appearance={{theme: ThemeSupa}}
            providers={['github', 'google', 'linkedin_oidc']}
          />
        }
      />
      <AccountHeader login={login} logout={logout}/>
      <Header/>
      <MarketStatus />

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
      </Routes>

      <Footer/>
    </BrowserRouter>
  );
}

export default App;
