import {Box, useTheme} from "@mui/system";
import {Link, useMediaQuery} from '@mui/material';
import {green, grey} from '@mui/material/colors';

import {navLinks} from "../../config/NavigationLinks";
import MobileNav from "./MobileNav";

function Navigation() {
  const theme = useTheme();
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('sm'));

  if (mobileFormat) {
    return <MobileNav />
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      borderLeft: {md: '2px solid black'},
      borderTop: {md: '2px solid black'},
      borderBottom: {md: `2px solid ${grey[300]}`},
      justifyContent: {xs: 'center'},
      flexGrow: 1,
    }}>
      {navLinks.map((link, i) => (
        <Link
          key={i}
          sx={{
            "&:hover": {
              color: green[900],
              borderRight: `1px solid ${grey[200]}`,
              borderLeft: `1px solid ${grey[200]}`
            },
            borderTop: {xs: 'none', sm: `2px solid ${grey[200]}`, md: 'none'},
            borderRight: '1px solid transparent',
            borderLeft: '1px solid transparent',
            textDecoration: 'none',
            color: {sm: grey[800], md: green[800]},
            mt: {sm: '10px', md: 0},
            pt: {sm: '4px', md: 0},
            fontWeight: 600,
            px: '5px',
            fontSize: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          href={link.url}
        >
          {link.text}
        </Link>
      ))}
    </Box>
  )
}

export default Navigation;