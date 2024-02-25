import React from 'react';
import {useSelector} from "react-redux";
import {
  Avatar,
  Divider,
  Drawer,
  List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText,
  Menu,
  Switch,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AccountMenu = ({ anchor, onClose, logout }) => {
  const theme = useTheme()
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('sm'));

  const {session} = useSelector(({authentication}) => authentication)
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
      <ListItemButton>
        <ListItemIcon><SettingsIcon /></ListItemIcon>
        <ListItemText primary={'Settings'} />
      </ListItemButton>
      <ListItem>
        <ListItemIcon><DarkModeIcon /></ListItemIcon>
        <ListItemText primary='Dark Mode' />
        <Switch />
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