import React, {useState} from 'react'
import {BarLoader} from "react-spinners";
import {useSelector} from "react-redux";
import {Button, Container} from "@mui/material";
import {Box} from "@mui/system";
import {Link} from "react-router-dom";
import {getCurrencyVal} from "../actions";

const Balances = () => {
  const authentication = useSelector(({authentication}) => authentication);
  const account = useSelector(({account}) => account?.activeAccount)
  const { currentBalances: current, initialBalances: initial } = account

  const status = authentication?.status
  const isLoggedIn = status?.isLoggedIn
  const isConnected = status?.isConnected

  const [hidden, setHidden] = useState(true)

  if (hidden) {
    return (
      <Container>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: '30px',}}
        >
          <Button onClick={() => setHidden(false)}>Show Balances</Button>
        </Box>
      </Container>
    )
  }

  const innerContent = () => {
    if (isLoggedIn && !isConnected) {
      return (
        <>
          <Link to="/auth/td_auth">Connect</Link>
          &nbsp;your TD Ameritrade account to view your balances
        </>
      )
    } else if (!status?.isLoaded) {
      return <BarLoader color='green' />
    } else {
      return (
        <>
          {`Account Value: ${getCurrencyVal(current?.liquidationValue)}`}<br />
          {`Available Funds: ${getCurrencyVal(current?.availableFunds)}`}<br />
          {`Cash: ${getCurrencyVal(current?.moneyMarketFund)}`}
        </>
      )
    }
  }

  if (!isLoggedIn || !account) {
    return
  }

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        mt: '30px',
        fontSize: {xs: '3.1vw', sm: '14px'}
      }}>
        {innerContent()}
        <Button onClick={() => setHidden(true)}>Hide Balances</Button>
      </Box>
    </Container>
  )
}

export default Balances;