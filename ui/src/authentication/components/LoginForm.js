import {Box, Button, TextField, Typography} from "@mui/material";
import {loginUser} from "../actions";
import {useDispatch} from "react-redux";

const LoginForm = ({ swap = () => {} }) => {
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value
    };
    dispatch(loginUser(data));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', mt: '25px'}}>
          <Typography variant='h5'>...or Log In with us</Typography>
          <TextField sx={{width: {md: '300px'}}} variant='outlined' label='Username' size='small' name='username'></TextField>
          <TextField sx={{width: {md: '300px'}}} variant='outlined' label='Password' size='small' type='password' name='password'></TextField>
          <Box sx={{display: 'flex', flexDirection: 'column-reverse', justifyContent: 'center', gap: '10px'}}>
            <Button href='/register' sx={{textDecoration: 'none'}}>New User?</Button>
            <Button variant='contained' type='submit'>Log In</Button>
          </Box>
        </Box>
      </form>
    </>
  )
}

export default LoginForm;