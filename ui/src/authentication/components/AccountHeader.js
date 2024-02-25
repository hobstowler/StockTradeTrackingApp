import React, {useState} from "react";
import {Box, Container, useTheme} from "@mui/system";
import {Avatar, Button, useMediaQuery} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import AccountMenu from "../../account/components/AccountMenu";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

const AccountHeader = ({login, logout}) => {
  const [anchor, setAnchor] = useState(null)

  const {session, status} = useSelector(({authentication}) => authentication)
  const user = session?.user

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.up('sm'))

  const openMenu = (e) => {
    setAnchor(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchor(null)
  }

  if (!smallScreen) {
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
        {session ?
          <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            {`Welcome, ${user?.user_metadata?.name}`}
            <Avatar
              onClick={openMenu}
              sx={{height: '32px', width: '32px', cursor: 'pointer'}}
              alt={user?.user_metadata?.full_name || ''}
              src={user?.user_metadata?.avatar_url}/>
          </Box> :
          <Button variant='outlined' size='small' color='success' onClick={login} sx={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
            <Box sx={{mt: '1px'}}>Log In</Box>
            <LoginOutlinedIcon/>
          </Button>
        }
        <AccountMenu anchor={anchor} onClose={closeMenu} logout={logout}/>
      </Box>
    </Container>
  )
}

export default AccountHeader