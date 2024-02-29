import {Box, useTheme} from "@mui/system";
import {Link, useMediaQuery} from '@mui/material';
import {green, grey} from '@mui/material/colors';

import {navLinks} from "../../config/NavigationLinks";
import {PAGES} from "../../application/constants"
import MobileNav from "./MobileNav";
import {setPage} from "../../application/actions";
import {useDispatch} from "react-redux";

function Navigation() {
  const theme = useTheme();
  const dispatch = useDispatch()
  const mobileFormat = !useMediaQuery(theme.breakpoints.up('sm'));

  const handleClick = (pageName) => {
    dispatch(setPage(pageName))
  }

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
      {PAGES.map((page, i) => (
        <Box
          key={i}
          onClick={() => {handleClick(page)}}
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
            cursor: 'pointer'
          }}
        >
          {page}
        </Box>
      ))}
    </Box>
  )
}

export default Navigation;