import LinkOffIcon from "@mui/icons-material/LinkOff";
import LoginIcon from '@mui/icons-material/Login';
import LinkIcon from '@mui/icons-material/Link';
import {IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu} from "@mui/material";
import React, {useState} from "react";
import {useTheme} from "@mui/system";
import {useNavigate} from "react-router-dom";

const AccountConnectorMenu = () => {
  const [anchor, setAnchor] = useState(null)
  const [schwabConnection, setSchwabConnection] = useState(1)
  const [tradierConnection, setTradierConnection] = useState(null)

  const connected = Boolean(schwabConnection) || Boolean(tradierConnection)

  const theme = useTheme();
  const navigate = useNavigate()

  const closeMenu = () => {
    setAnchor(null)
  }

  const openMenu = (e) => {
    setAnchor(e.currentTarget)
  }

  const handleSchwabClick = () => {
    if (!Boolean(schwabConnection)) {
      navigate('/auth/schwab')
    }
  }

  const handleTradierClick = () => {
    if (!Boolean(tradierConnection)) {
      navigate('/auth/tradier')
    }
  }

  return (
    <>
      <IconButton
        size='small'
        onClick={openMenu}
        sx={{
          ml: '12px',
          backgroundColor: theme.palette.grey[50],
          '&:hover': {
            backgroundColor: theme.palette.grey[100]
          },
          '& > svg': {
            color: connected ? theme.palette.success.main : theme.palette.error.main
          }}}>
        {connected ? <LinkIcon /> : <LinkOffIcon />}
      </IconButton>
      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closeMenu}
        keepMounted
        anchorOrigin={{horizontal:'right', vertical: 'bottom'}}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <List
          dense
          sx={{py: 0}}
        >
          <ListItemButton
            onClick={handleSchwabClick}
            sx={{
              '&:hover': {
                '& .MuiTypography-root': {color: '#00a0df'}
              }
            }}
          >
            <ListItemIcon
              sx={{
                '& > svg': {
                  color: '#00a0df'
                },
            }}
            >
              <LoginIcon color='blue' />
            </ListItemIcon>
            <ListItemText primary={
              Boolean(schwabConnection) ? 'Disconnect from Schwab' : 'Connect to Schwab'
            } />
          </ListItemButton>
          <ListItemButton
            onClick={handleTradierClick}
            sx={{
              '&:hover': {
                '& .MuiTypography-root': {color: '#f6b350'}
              }
            }}
          >
            <ListItemIcon
              sx={{'& > svg': {
                color: '#f6b350'
              }}}
            >
              <LoginIcon color='orange' />
            </ListItemIcon>
            <ListItemText primary={
              Boolean(tradierConnection) ? 'Disconnect from Tradier' : 'Connect to Tradier'
            } />
          </ListItemButton>
        </List>
      </Menu>
    </>
  )
}

export default AccountConnectorMenu