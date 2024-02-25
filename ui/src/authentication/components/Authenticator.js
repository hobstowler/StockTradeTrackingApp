import {Card, Container, Modal} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const Authenticator = ({ auth, displayLogin, setDisplayLogin }) => {
  const [open, setOpen] = useState(false)
  const {session} = useSelector(({authentication}) => authentication)

  const handleClose = (event, reason) => {
    if (reason && reason !== "backdropClick")
        return;
    setOpen(false);
    setDisplayLogin(false)
  }

  useEffect(() => {
    setOpen(session === null)
  }, [session])

  if (session) return

  return (
    <Modal
      open={open || displayLogin}
      onClose={handleClose}
    >
      <Container maxWidth='xs' sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
        <Card sx={{backgroundColor: 'white', p: '24px', width: '100%'}}>
          {auth}
        </Card>
      </Container>
    </Modal>
  )
}

export default Authenticator;