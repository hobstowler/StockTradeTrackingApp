import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Box} from "@mui/system";
import {FormControlLabel, Switch} from "@mui/material";
import CompactList from "./CompactList";
import ExpandedList from "./ExpandedList";

const WatchListCard = () => {
  const {activeGroup, lastUpdate} = useSelector(({stock}) => stock.watchList)
  const [compact, setCompact] = useState(true)

  useEffect(() => {

  }, [activeGroup])

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
      {activeGroup === undefined ?
        <Box sx={{display: 'flex', justifyContent: 'center', my: '18px', fontWeight: 600, fontSize: '16px', pb: '24px'}}>Select a Group</Box> :
        <>
          {compact ? <CompactList/> : <ExpandedList/>}
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: '24px', pr: '8px'}}>
            <Box sx={{fontSize: '12px', fontStyle: 'italic'}}>{`Last Update: ${lastUpdate.toLocaleString()}`}</Box>
            <FormControlLabel control={<Switch size='small' color='success' checked={compact} onChange={() => {setCompact(!compact)}}/>} label='Compact' />
          </Box>
        </>
      }
    </Box>
  )
}

export default WatchListCard