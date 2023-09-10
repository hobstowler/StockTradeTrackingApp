import {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
  Menu,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Divider,
  Link,
  Box,
  Switch,
  Drawer,
  useMediaQuery, useTheme
} from "@mui/material";

const AccountMenu = ({ anchor, onClose }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('sm'));

  const authentication = useSelector(({authentication}) => authentication)
  const user = authentication?.user
  const status = authentication?.status
  const isLoggedIn = status?.isLoggedIn
  const isConnected = status?.isConnected

  const account = useSelector(({account}) => account)
  const activeAccount = account.activeAccount
  const accounts = account.accounts
  const activeAccountId = activeAccount[Object.keys(activeAccount)[0]]?.accountId

  const [accountSwitch, setAccountSwitch] = useState(false)

  if (!isLoggedIn || !account) {
    return
  }

  const handleAccountSwitch = (account) => {
    dispatch({type: 'change_active_account', activeAccount: account})
    setAccountSwitch(false)
  }

  const menuContent =
    (<Box>
      <MenuItem><Box sx={{fontWeight: 'bold'}}>{`Welcome, ${user?.firstName}`}</Box></MenuItem>
      <MenuItem><Box sx={{ml: '16px'}}>Profile</Box></MenuItem>
      <MenuItem><Box sx={{ml: '16px'}}>Settings</Box></MenuItem>
      <Divider />
      <MenuItem>
        <Box sx={{fontWeight: 'bold'}}>
          Connected Account
        </Box>
      </MenuItem>
      {accountSwitch ?
        (
          <Box>
            {accounts.map((account) => {
              const id = account[Object.keys(account)[0]]?.accountId
              return <MenuItem onClick={() => handleAccountSwitch(account)}>
                  <Box sx={{ml: '16px'}}>
                    {id}
                  </Box>
                <Link sx={{textDecoration: 'none', ml: '8px'}}>Select</Link>
                </MenuItem>
            })}
            <MenuItem onClick={() => setAccountSwitch(false)}>
              <Link sx={{textDecoration: 'none', ml: '16px'}}>
                Cancel
              </Link>
            </MenuItem>
          </Box>
        ) :
        (
          <Box>
          <MenuItem>
            <Box sx={{ml: '16px'}}>
              {'Active Account'}
            </Box>
          </MenuItem>
          <MenuItem onClick={() => setAccountSwitch(true)}>
            <Box sx={{ml: '16px', color: 'darkgrey'}}>
              {activeAccountId}
              <Link sx={{textDecoration: 'none', ml: '10px'}} onClick={() => setAccountSwitch(true)}>
                Switch
              </Link>
            </Box>
          </MenuItem>
          </Box>
        )
      }
      <Divider />
      <MenuItem><Box sx={{fontWeight: 'bold'}}>Settings</Box></MenuItem>
      <FormGroup>
        <MenuItem>
          <FormControlLabel control={<Switch />} label='Dark Mode' labelPlacement='start'/>
        </MenuItem>
        <MenuItem><Box sx={{ml: '16px'}}>ABC</Box></MenuItem>
        <MenuItem><Box sx={{ml: '16px'}}>DEF</Box></MenuItem>
      </FormGroup>
      <Divider />
      <MenuItem>
        <Box sx={{fontWeight: 'bold'}}>Account</Box>
      </MenuItem>
      <MenuItem>
        <Box sx={{ml:'16px'}}>Disconnect</Box>
      </MenuItem>
      <MenuItem>
        <Box sx={{ml:'16px'}}>{`Not ${user?.firstName}?`}<Link sx={{textDecoration: 'none', ml: '3px'}}>Log Out</Link></Box>
      </MenuItem>
      <MenuItem>

      </MenuItem>
    </Box>);

  return mobileFormat ? (
    <Drawer
      anchor='right'
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      PaperProps={{sx:{width: '40% !important'}}}
    >
      {menuContent}
    </Drawer>
  ) : (

    <Menu
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      keepMounted
      PaperProps={{sx:{width: '225px !important'}}}
      anchorOrigin={{horizontal:'center', vertical: 'bottom'}}
      transformOrigin={{horizontal: 0, vertical: 5}}
    >
      {menuContent}
    </Menu>
  )
}

export default AccountMenu;