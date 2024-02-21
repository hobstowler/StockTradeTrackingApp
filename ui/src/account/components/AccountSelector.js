import {useDispatch, useSelector} from "react-redux";
import {Box, Container, FormControl, MenuItem, Select, Tooltip, useMediaQuery, useTheme} from "@mui/material";

const AccountSelector = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const account = useSelector(({account}) => account)
  const activeAccount = account.activeAccount
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('md'));

  const accountIds = account.accounts.map(a => a.accountId)

  const handleChange = (e) => {
    const accounts = account.accounts
    for (const account of accounts) {
      if (e.target.value === account?.accountId) {
        dispatch({type: 'change_active_account', activeAccount: account})
        return
      }
    }
  }

  if (account?.accounts.length === 0 || mobileFormat) {
    return
  }

  return (
    <Container maxWidth={"md"}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'right', mr: '20px', mt: '20px'}}>
        <Box sx={{mr: '15px', fontSize: '15px', pb: '5px', color: 'darkgrey'}}>
          Active Account:
        </Box>
        <Tooltip title={accountIds.length <= 1 ? 'No accounts to switch to' : 'Active account in view'} arrow>
        <FormControl variant='standard' size='small' disabled={accountIds.length <= 1}>
          <Select
            sx={{pl: '10px', pr: '5px'}}
            labelId='active-account-select-label'
            id='active-account-select'
            label='Active Account'
            value={activeAccount.accountId}
            onChange={handleChange}
          >
            {accountIds.map((accountId) =>
              <MenuItem value={accountId}>{accountId}</MenuItem>
            )}
          </Select>
        </FormControl>
        </Tooltip>
      </Box>
    </Container>
  )
}

export default AccountSelector;