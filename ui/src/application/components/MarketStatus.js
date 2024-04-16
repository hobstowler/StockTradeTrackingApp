import {useSelector} from "react-redux";
import {Box, Container} from "@mui/system";
import {useFormatStatus} from "../../shared/actions";
import {Skeleton} from "@mui/material";

const MarketStatus = () => {
  const clock = useSelector(({application}) => application?.clock)
  const marketStatus = useFormatStatus(clock?.state)
  const nextStatus = useFormatStatus(clock?.next_state)

  return (
    <Container className='MarketStatus'>
      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mx: '24px', my: '8px', fontSize: '13px'}}>
        {
          clock !== null ? (
          <>
            <Box>{`Market status: `}{marketStatus}</Box>
            <Box>{`Market will be `}{nextStatus}{` at ${clock?.next_change}`}</Box>
          </>) : (
          <>
            <Skeleton variant='text' width={124}/>
            <Skeleton variant='text' width={224}/>
          </>)
        }
      </Box>
    </Container>
  )
}

export default MarketStatus