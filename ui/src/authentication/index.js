import {Box, Container, Typography} from "@mui/material";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import {GithubLoginButton, GoogleLoginButton} from "react-social-login-buttons";
import {useState} from "react";

const Authentication = ({ login }) => {

  return (
    <Container maxWidth={'md'}>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', mt: '100px'}}>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center'}}>
          <Box sx={{width: '300px'}}>
            <Typography variant='h5'>{login ? 'Login' : 'Register'} Using...</Typography>
            <GoogleLoginButton />
            <GithubLoginButton />
          </Box>
        </Box>
        {login ? <LoginForm /> : <RegisterForm />}
      </Box>
    </Container>
  )
}

export default Authentication;