import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box, Container, useTheme} from "@mui/system";
import {Button, useMediaQuery} from '@mui/material';
import {useSelector} from "react-redux";
import {BsFillGearFill} from "react-icons/bs";
import {grey} from '@mui/material/colors';

export default function LogIn({activeAccount, setLogIn, tdConnected, setTdConnected, disconnect}) {
  const theme = useTheme();
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('sm'));

  const user = useSelector((state) => state.user)
  const isLoggedIn = user.loggedIn
  const connected = user.connected

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [error, setError] = useState('')

  const cookieValue = (val) => document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${val}=`))
    ?.split('=')[1];

  useEffect(() => {
    if (cookieValue("ugly_jwt") !== undefined) {
      fetch("/auth/login", {method: "GET"})
        .then(async response => {
          const hasJson = response.headers.get('content-type')?.includes('application/json')
          const data = hasJson ? await response.json() : null

          if (!response.ok) {
            let error = (data && data.error) || response.status
            return Promise.reject(error)
          }

          setLogIn(data.loggedIn)
          setUsername(data.username)
        })
    }
  }, [])

  useEffect(() => {
    tdVerify()
  }, [isLoggedIn])

  const tdVerify = () => {
    fetch('/auth/verify_td')
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const data = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (data && data.error) || response.status
          return Promise.reject(error)
        }

        setTdConnected(data.valid)
        setError(data.error)
      })
  }

  const handleLogout = () => {
    fetch('/auth/logout', {method: 'POST'})
      .then(response => {
        if (response.status === 200) {
          setLogIn(false)
          setUsername('')
          navigate('/loggedOut')
        }
      })
  }

  const settingScrollOut = () => {
    // TODO
  }

  if (mobileFormat) {
    return null
  }
  return (
    <Container sx={{maxWidth: {sm: "md", md: 'lg'}, mt: "20px"}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        mb: '10px',
        mr: '30px',
        textAlign: 'right'
      }}>
        {
          isLoggedIn ?
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                {`Logged in as ${username}`}
              </Box>
              {connected ?
                <Button
                  variant={"outlined"}
                  onClick={disconnect}
                  sx={{mx: '5px', px: '8px', py: '1px'}}
                >
                  Disconnect
                </Button> :
                <Button
                  variant={"outlined"}
                  href={"/auth/td_auth"}
                  sx={{mx: '5px', px: '8px', py: '1px'}}
                >
                  Connect
                </Button>
              }
              <Button variant={"contained"} sx={{mx: '5px', px: '8px', py: '1px'}} onClick={handleLogout}>Log
                Out</Button>
            </Box> :
            <Button href="/login" variant={"contained"} sx={{px: '8px', py: '1px'}}>
              {"Log in"}
            </Button>
        }
        <Button href='/account'
                sx={{fontSize: '20px', px: '8px', ml: '5px', color: grey[700]}}><BsFillGearFill/></Button>
        {/*<p>{error}</p>*/}
      </Box>
    </Container>
  )
}