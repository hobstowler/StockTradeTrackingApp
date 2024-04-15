import './App.css';
import Header from "./shared/components/header/Header";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React, {useEffect, useRef, useState} from "react";
import {default as Home} from "./application";
import {default as Stocks} from "./stock";
import {default as Options} from "./options";
import {default as Insights} from "./insights";
import {default as Watch} from "./watch";
import AccountHeader from "./authentication/components/AccountHeader";
import {useDispatch, useSelector} from "react-redux";
import MarketStatus from "./application/components/MarketStatus";
import {createClient} from "@supabase/supabase-js";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {Auth} from "@supabase/auth-ui-react";
import {setSession} from "./authentication/actions";
import Authenticator from "./authentication/components/Authenticator";
import {refreshEverything} from "./stock/actions";
import {Container} from "@mui/system";
import SchwabAuth from "./authentication/components/schwab/SchwabAuth";
import {getClock} from "./application/actions";

const PROJECT_URL = process.env.REACT_APP_SUPABASE_PROJECT_URL
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY

const supabase = createClient(PROJECT_URL, API_KEY)

const App = () => {
  const [displayLogin, setDisplayLogin] = useState(false)
  const {lastUpdate} = useSelector(({stock}) => stock.watchList)
  const {session} = useSelector(({authentication}) => authentication)
  const {clock} = useSelector(({application}) => application)
  const {account: accountStream, market: marketStream} = useSelector(({application}) => application.streaming)
  const updateRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('ok')
  }, [dispatch])

  useEffect(() => {
    if (lastUpdate === null) {
      dispatch(refreshEverything())
    dispatch(getClock())
    }
  }, [session?.access_token])

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
    if (marketStream) return

    // dispatch(refreshEverything())

    const intervalId = setInterval(() => {
      const diffInSeconds = (new Date() - updateRef.current) / 1000
      if (diffInSeconds > 14) {
        dispatch(refreshEverything())
      }
    }, 15000)

    return () => clearInterval(intervalId)
  }, [marketStream, clock])

  const login = () => {
    setDisplayLogin(true)
  }

  const logout = () => {
    supabase.auth.signOut({scope: 'local'})
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
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
          } />
          <Route path='/auth/schwab' element={<SchwabAuth />} />
          <Route path='/auth/schwab/return_auth' element={<Stocks />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
