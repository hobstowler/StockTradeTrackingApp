import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box, Container, useTheme} from "@mui/system";
import {Button, Tooltip, useMediaQuery} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {BsFillGearFill} from "react-icons/bs";
import {grey} from '@mui/material/colors';
import AccountMenu from "../../account/components/AccountMenu";
import {loginUser, logoutUser, tdConnect, tdVerify} from "../actions";
import {PulseLoader} from "react-spinners";
import LinkIcon from '@mui/icons-material/Link';

export default function LogIn() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector(({authentication}) => authentication?.user)
  const status = useSelector(({authentication}) => authentication?.status)
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

  const [anchor, setAnchor] = useState(null)

  const openMenu = (e) => {
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
                <Tooltip title='Connected to TD Ameritrade'>
                  <LinkIcon sx={{color: 'green', ml: '10px', mt: '4px', fontSize: '30px'}}/>
                </Tooltip>
                :
                <Button sx={{ml: '10px'}} onClick={() => dispatch(tdConnect())} variant="contained">
                  {status?.processing ? <PulseLoader size={12} color={theme.palette.primary.light}/> : 'Connect'}
                </Button>
              }
              <Button sx={{ml: '10px'}} variant={"outlined"} onClick={() => dispatch(logoutUser())}>
                {status?.processing ? <PulseLoader size={12} color='white'/> : 'Log Out'}</Button>
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
        <AccountMenu anchor={anchor} onClose={closeMenu}/>
        {/*<p>{error}</p>*/}
      </Box>
    </Container>
  )
}