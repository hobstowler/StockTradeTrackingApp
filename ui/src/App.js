import './App.css';
import Home from "./application/components/Home";
import Header from "./shared/components/Header";

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Footer from "./shared/components/Footer";
import {default as Watch} from "./watch";
import React, {useEffect, useRef, useState} from "react";
import {default as Stocks} from "./stock";
import {default as Options} from "./options";
import {default as Crypto} from "./crypto";
import {default as Insights} from "./insights";
import {default as Account} from "./account";
import AccountHeader from "./authentication/components/AccountHeader";
import {useDispatch, useSelector} from "react-redux";
import MarketStatus from "./shared/components/MarketStatus";
import {createClient} from "@supabase/supabase-js";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {Auth} from "@supabase/auth-ui-react";
import {setSession} from "./authentication/actions";
import Authenticator from "./authentication/components/Authenticator";
import {refreshEverything} from "./stock/actions";
import {Container} from "@mui/system";

const PROJECT_URL = process.env.REACT_APP_SUPABASE_PROJECT_URL
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY

const supabase = createClient(PROJECT_URL, API_KEY)

const App = () => {
  const [displayLogin, setDisplayLogin] = useState(false)
  const {lastUpdate} = useSelector(({stock}) => stock.watchList)
  const updateRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    updateRef.current = lastUpdate
  }, [lastUpdate])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: {session}}) => {
      dispatch(setSession(session))
    })

    const {data: {subscription},} = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const diffInSeconds = (new Date() - updateRef.current) / 1000
      if (diffInSeconds > 14) {
        dispatch(refreshEverything())
      }
    }, 15000)

    return () => clearInterval(intervalId)
  }, [])

  const login = () => {
    setDisplayLogin(true)
  }

  const logout = () => {
    supabase.auth.signOut({scope: 'local'})
  }

  return (
    <>
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
      <Header />
      <MarketStatus />

      <Container sx={{maxWidth: {xs: 'md', lg: 'lg'}}}>
        <Home/>
        <Stocks/>
        <Options/>
        <Watch/>
        <Insights/>
      </Container>
    </>
  );
}

export default App;
