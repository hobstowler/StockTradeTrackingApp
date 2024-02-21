import {Box, Button, TextField, Typography} from "@mui/material";
import {Link} from 'react-router-dom';
import {registerUser} from "../actions";
import {useDispatch} from "react-redux";

const RegisterForm = ({ initialData }) => {
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      password: e.target.password.value,
      email: e.target.email.value,
    };
    dispatch(registerUser(data));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', mt: '25px'}}>
          <Typography variant='h5'>{initialData ? 'Confirm your details.' : '...or Register with us'}</Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <TextField sx={{maxWidth: {md: '145px'}}} variant='outlined' label='First Name' size='small' name='firstName'/>
            <TextField sx={{maxWidth: {md: '145px'}}} variant='outlined' label='Last Name' size='small' name='lastName'/>
          </Box>
          <TextField sx={{width: {md: '300px'}}} variant='outlined' label='Email' size='small' type='email' name='email' />
          <TextField sx={{width: {md: '300px'}}} variant='outlined' label='Password' size='small' type='password' name='password' />
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px'}}>
            <Link to='/login'><Button sx={{textDecoration: 'none'}}>Have an Account?</Button></Link>
            <Button variant='contained' type='submit'>Register</Button>
          </Box>
        </Box>
      </form>
    </>
  )
}

export default RegisterForm;