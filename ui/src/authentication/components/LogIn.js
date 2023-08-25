import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box, Container, useTheme} from "@mui/system";
import {Button, useMediaQuery} from '@mui/material';
import {Link} from 'react-router-dom'
import {useSelector} from "react-redux";
import {BsFillGearFill} from "react-icons/bs";
import {grey} from '@mui/material/colors';
import AccountMenu from "../../account/components/AccountMenu";

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

  }

  const settingScrollOut = () => {
    // TODO
  }

  const [anchor, setAnchor] = useState(null)

  const openMenu = (e) => {
    console.log('ok')
    setAnchor(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchor(null)
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
                <Button variant={"outlined"} onClick={disconnect}>Disconnect</Button> :
                <Link to="/auth/td_auth">
                  <Button variant="outlined">Connect</Button>
                </Link>
              }
              <Button variant={"contained"} onClick={handleLogout}>Log
                Out</Button>
            </Box> :
            <Link to="/login">
              <Button variant={"contained"}>Log in</Button>
            </Link>
        }
        <Button
          onClick={openMenu}
          sx={{fontSize: '20px', px: '8px', ml: '5px', color: grey[700]}}
        >
          <BsFillGearFill/>
        </Button>
        <AccountMenu anchor={anchor} onClose={closeMenu} />
        {/*<p>{error}</p>*/}
      </Box>
    </Container>
  )
}