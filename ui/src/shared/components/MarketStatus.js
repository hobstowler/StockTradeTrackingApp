import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getClock} from "../../application/actions";
import {Box, Container, useTheme} from "@mui/system";

const MarketStatus = () => {
  const clock = useSelector(({application}) => application?.clock)
  const dispatch = useDispatch()
  const theme = useTheme()

  useEffect(() => {
      dispatch(getClock())
  }, [])

  const formatStatus = (marketStatus) => {
    switch (marketStatus) {
      case 'premarket':
        return <Box sx={{color: theme.palette.primary.light, display: 'inline', fontWeight: 600}}>Pre Market</Box>
      case 'open':
        return <Box sx={{color: theme.palette.success.main, display: 'inline', fontWeight: 600}}>Open</Box>
      case 'postmarket':
        return <Box sx={{color: theme.palette.secondary.dark, display: 'inline', fontWeight: 600}}>Post Market</Box>
      case 'closed':
        return <Box sx={{color: theme.palette.error.main, display: 'inline', fontWeight: 600}}>Closed</Box>
      default:
        return marketStatus
    }
  }

  return (
    <Container className='MarketStatus'>
      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mx: '24px', my: '8px', fontSize: '13px'}}>
        <Box>{`Market status: `}{formatStatus(clock?.state)}</Box>
        <Box>{`Market will be `}{formatStatus(clock?.next_state)}{` at ${clock?.next_change}`}</Box>
      </Box>
    </Container>
  )
}

export default MarketStatus