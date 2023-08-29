import {useSelector} from "react-redux";
import {Box, Container, FormControl, FormHelperText, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";

const AccountSelector = () => {
  const account = useSelector(({account}) => account)
  const activeAccount = account.activeAccount

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

  const handleChange = () => {

  }

  if (account?.accounts.length === 0) {
    return
  }

  return (
    <Container maxWidth={"md"}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'right', mr: '20px', mt: '20px'}}>
        <Box sx={{mr: '15px', fontSize: '15px', pb: '5px'}}>
          Active Account:
        </Box>
        <FormControl variant='standard' size='small' disabled={accountIds.length < 1}>
          <Select
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
      </Box>
    </Container>
  )
}

export default AccountSelector;