import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
  Avatar,
  Divider,
  Drawer,
  List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader,
  Menu,
  Switch,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import {setMarketStream, setAccountStream, setDarkMode} from "../../application/actions";

const AccountMenu = ({ anchor, onClose, logout }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('sm'));

  const {session} = useSelector(({authentication}) => authentication)
  const {darkMode} = useSelector(({application}) => application)
  const {account, market} = useSelector(({application}) => application.streaming)
  const user = session?.user

  const handleLogout = () => {
    onClose()
    logout()
  }

  const menuContent = (
    <List disablePadding>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={user?.user_metadata?.avatar_url} />
        </ListItemAvatar>
        <ListItemText  primary={user?.user_metadata?.name} secondary={user?.user_metadata?.email} />
      </ListItem>
      <Divider />
      <ListItemButton>
        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
        <ListItemText primary={'Profile'} />
      </ListItemButton>
      <ListItem>
        <ListItemIcon><DarkModeIcon /></ListItemIcon>
        <ListItemText primary='Dark Mode' />
        <Switch checked={darkMode} onClick={() => {dispatch(setDarkMode(!darkMode))}}/>
      </ListItem>
      <ListItemButton>
        <ListItemIcon><SettingsIcon /></ListItemIcon>
        <ListItemText primary={'Settings'} />
      </ListItemButton>
      <Divider />
      <ListSubheader>Streaming</ListSubheader>
      <ListItem>
        <ListItemIcon><SyncAltIcon /></ListItemIcon>
        <ListItemText primary='Market Data' />
        <Switch checked={market} onClick={() => {dispatch(setMarketStream(!market))}}/>
      </ListItem>
      <ListItem>
        <ListItemIcon><SettingsInputAntennaIcon /></ListItemIcon>
        <ListItemText primary='Account Data' />
        <Switch checked={account} onClick={() => {dispatch(setAccountStream(!account))}}/>
      </ListItem>
      <Divider />
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary='Log Out' />
      </ListItemButton>
    </List>
  );

  return mobileFormat ? (
    <Drawer
      anchor='right'
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      PaperProps={{sx:{width: '40% !important'}}}
      chil
    >
      {menuContent}
    </Drawer>
  ) : (
    <Menu
      PaperProps={{sx: {minWidth: '300px'}}}
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      keepMounted
      anchorOrigin={{horizontal:'right', vertical: 'top'}}
      transformOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      {menuContent}
    </Menu>
  )
}

export default AccountMenu;