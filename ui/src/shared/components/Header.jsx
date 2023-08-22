import Navigation from "./Navigation";
import {Box, Container, useTheme} from "@mui/system";
import {green, grey} from '@mui/material/colors';

import LogIn from "../../authentication/components/LogIn";
import {useMediaQuery} from "@mui/material";

function Header() {
  return (
    <Container maxWidth={"md"}>
      <Box sx={{display: 'flex', flexDirection: {xs: 'row-reverse', sm: 'column', md: 'row'}, justifyContent: 'center', px: {xs: 0, md:'15px'}}}>
        <Box sx={{
          textAlign: {xs: 'left', sm: 'center', md: 'right'},
          pb: {xs: '0px', md: '10px'},
          pr: {xs: 0, md: '20px'},
          borderBottom: {xs: 'none', md: '2px solid black'},
        }}>
          <Box sx={{fontSize: {xs: '7.5vw', sm: '2.8rem'}, fontWeight: 600, color: green[800] }}>The Ugly Trading App</Box>
          <Box sx={{fontSize: {xs: '4.3vw', sm: '1.6rem'}, fontWeight: 600, color: green[600]}}>Powered by Stunning. Good. Looks.</Box>
        </Box>
        <Navigation />
      </Box>
    </Container>
  )
}

export default Header;