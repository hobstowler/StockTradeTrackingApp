import {Box} from "@mui/system";
import {grey} from "@mui/material/colors";
import {GiHamburgerMenu} from "react-icons/gi";
import AccountMenu from "../../../account/components/AccountMenu";
import {useState} from "react";

const MobileNav = () => {
  const [anchor, setAnchor] = useState(null)

  const openMenu = (e) => {
    setAnchor(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchor(null)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontSize: '8vw',
          color: grey[900],
          ml: '20px',
          cursor: 'pointer'
        }}
        onClick={openMenu}
      >
        <GiHamburgerMenu/>
      </Box>
      <AccountMenu anchor={anchor} onClose={closeMenu} />
    </>
  )
}

export default MobileNav