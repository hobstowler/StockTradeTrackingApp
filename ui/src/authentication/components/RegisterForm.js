import {Box, Button, Link, TextField, Typography} from "@mui/material";

const RegisterForm = ({ initialData }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
    }
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
          <TextField sx={{width: {md: '300px'}}} variant='outlined' label='Username' size='small' name='username' />
          <TextField sx={{width: {md: '300px'}}} variant='outlined' label='Password' size='small' type='password' name='password' />
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px'}}>
            <Button href='/login' sx={{textDecoration: 'none'}}>Have an Account?</Button>
            <Button sx={{width: '100px'}} variant='contained' type='submit'>Log In</Button>
          </Box>
        </Box>
      </form>
    </>
  )
}

export default RegisterForm;