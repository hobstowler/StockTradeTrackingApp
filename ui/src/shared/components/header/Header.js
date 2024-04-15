import Navigation from "./Navigation";
import {Box, Container} from "@mui/system";
import {green} from '@mui/material/colors';

const Header = () => {
  return (
    <Container className='header-container' maxWidth={"lg"}>
      <Box sx={{
        display: 'flex',
        flexDirection: {xs: 'row', sm: 'column', md: 'row'},
        justifyContent: 'center',
        px: 0,
        mt: {xs: '20px', md: 0},
      }}>
        <Box sx={{
          textAlign: {xs: 'right', sm: 'center', md: 'right'},
          pb: {xs: '0px', md: '10px'},
          pr: {xs: 0, md: '20px'},
          borderBottom: {xs: 'none', md: '2px solid black'},
          flexGrow: 1,
        }}>
          <Box sx={{fontSize: {xs: '6.5vw', sm: '2.4rem'}, fontWeight: 600, color: green[800]}}>
            The Ugly Trading App
          </Box>
          <Box sx={{fontSize: {xs: '3.3vw', sm: '1.2rem'}, fontWeight: 600, color: green[600]}}>
            Powered by Stunning. Good. Looks.
          </Box>
        </Box>
        <Navigation/>
      </Box>
    </Container>
  )
}

export default Header;