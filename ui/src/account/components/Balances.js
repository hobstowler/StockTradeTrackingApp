import React, {useState} from 'react'
import {BarLoader} from "react-spinners";
import {useSelector} from "react-redux";
import {Container, Tab, Tabs} from "@mui/material";
import {Box} from "@mui/system";

const Balances = () => {
  const isLoaded = false//useSelect();
  const user = useSelector((state) => state.user)
  const isLoggedIn = user.loggedIn
  const connected = user.connected
  // const isConnected = useSelector();
  // const balances = useSelector();

  if (!isLoggedIn) {
    return
  }

  if (!isLoaded) {
    return (
      <Container>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          mt: '20px'
        }}>
          <BarLoader color={"green"}/>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Box>
        <Tabs>
          <Tab label='Tab 1' value='1' />
        </Tabs>
      </Box>
    </Container>
  )
}

export default Balances;