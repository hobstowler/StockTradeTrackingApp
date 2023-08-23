import {useSelector} from "react-redux";
import {Menu, MenuItem} from "@mui/material";

const AccountMenu = ({ anchor, onClose }) => {
  const user = useSelector((state) => state.user)
  const isLoggedIn = user.loggedIn
  const connected = user.connected

  return (
    <Menu
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      keepMounted
    >
      <MenuItem>ABC</MenuItem>
      <MenuItem>DEF</MenuItem>
    </Menu>
  )
}

export default AccountMenu;