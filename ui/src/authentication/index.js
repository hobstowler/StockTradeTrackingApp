import {Box, Container} from "@mui/material";

const Authentication = ({login, register}) => {

  return (
    <Container><Box>{login ? 'Log In' : 'Register'}</Box></Container>
  )
}

export default Authentication;