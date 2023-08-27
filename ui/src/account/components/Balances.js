import React from 'react'
import {BarLoader} from "react-spinners";
import {useSelector} from "react-redux";
import {Container} from "@mui/material";
import {Box} from "@mui/system";
import {Link} from "react-router-dom";

const Balances = () => {
  const account = useSelector(({account}) => account);
  const user = useSelector(({user}) => user)
  const isLoggedIn = user?.isLoggedIn
  const isConnected = user?.isConnected

  const innerContent = () => {
    if (isLoggedIn && !isConnected) {
      return (
        <>
          <Link to="/auth/td_auth">Connect</Link>
          &nbsp;your TD Ameritrade account to view your balances
        </>
      )
    } else if (!account?.isLoaded) {
      return <BarLoader color='green' />
    } else {
      return (
        <>abc</>
      )
    }
  }

  if (!isLoggedIn) {
    return
  }

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        mt: '30px',
        fontSize: {xs: '3.1vw', sm: '14px'}
      }}>
        {innerContent()}
      </Box>
    </Container>
  )
}

export default Balances;