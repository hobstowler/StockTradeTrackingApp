import {Box, useTheme} from "@mui/system";
import {setActiveSymbol} from "../../stock/actions";
import {useDispatch} from "react-redux";

const CompactWatchTab = (props) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setActiveSymbol(props.symbol))
  }

  return (
    <Box
      onClick={handleClick}
      {...props}
      sx={{
        ...props.sx,
        cursor: 'pointer',
        px: '1px',
        py: '12px',
        minWidth: '60px',
        maxWidth: '60px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.grey[100],
        '&:hover': {
          backgroundColor: theme.palette.grey[200],
          color: props.highlightColor || 'inherit'
        },
        mx: '1px',
        my: '4px'}}>
      {props.children}
    </Box>)
}

export default CompactWatchTab