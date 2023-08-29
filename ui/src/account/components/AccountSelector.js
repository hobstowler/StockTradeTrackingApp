import {useDispatch, useSelector} from "react-redux";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {useEffect, useState} from "react";

const AccountSelector = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const account = useSelector(({account}) => account)
  const activeAccount = account.activeAccount
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (account?.accounts) {
      findAccountIds(account?.accounts)
    }
  }, [account])

  const [accountIds, setAccountIds] = useState([])

  const findAccountIds = (accounts) => {
    const ids = []
    for (const acc of accounts) {
      ids.push(acc[Object.keys(acc)[0]]?.accountId)
    }

    setAccountIds(ids)
  }

  const handleChange = (e) => {
    const accounts = account.accounts
    for (const acc of accounts) {
      if (e.target.value === acc[Object.keys(acc)[0]]?.accountId) {
        dispatch({type: 'change_active_account', activeAccount: acc})
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
            value={activeAccount[Object.keys(activeAccount)[0]].accountId}
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