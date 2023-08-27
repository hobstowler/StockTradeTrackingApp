import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box, Container, useTheme} from "@mui/system";
import {Button, useMediaQuery} from '@mui/material';
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {BsFillGearFill} from "react-icons/bs";
import {grey} from '@mui/material/colors';
import AccountMenu from "../../account/components/AccountMenu";
import {loginUser} from "../actions";
import {disconnect, tdConnect, tdVerify} from "../actions"

export default function LogIn() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector(({authentication}) => authentication)
  const status = user?.status
  const isLoggedIn = status?.isLoggedIn
  const isConnected = status?.isConnected

  const cookieValue = (val) => document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${val}=`))
    ?.split('=')[1];

  useEffect(() => {
    if (cookieValue("ugly_jwt") !== undefined) {
      loginUser()
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(tdVerify())
    }
  }, [isLoggedIn])

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

  if (!useMediaQuery(theme.breakpoints.up('sm'))) {
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
                {`Logged in as ${user?.username}`}
              </Box>
              {isConnected ?
                <Button sx={{ml: '10px'}} variant={"outlined"} onClick={() => dispatch(disconnect)}>Disconnect</Button> :
                <Button sx={{ml: '10px'}} onClick={() => dispatch(tdConnect())} variant="outlined">Connect</Button>
              }
              <Button sx={{ml: '10px'}} variant={"contained"} onClick={handleLogout}>Log
                Out</Button>
            </Box> :
            <Link to="/login">
              <Button variant={"contained"}>Log in</Button>
            </Link>
        }
        <Button
          onClick={openMenu}
          sx={{fontSize: '20px', px: '8px', ml: '10px', color: grey[700]}}
        >
          <BsFillGearFill/>
        </Button>
        <AccountMenu anchor={anchor} onClose={closeMenu} />
        {/*<p>{error}</p>*/}
      </Box>
    </Container>
  )
}