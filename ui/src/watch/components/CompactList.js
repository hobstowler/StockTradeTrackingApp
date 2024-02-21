import {Box, useTheme} from "@mui/system";
import {useSelector} from "react-redux";
import CompactWatchTab from "./CompactWatchTab";

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const CompactList = () => {
  const {groups, activeGroup} = useSelector(({stock}) => stock.watchList)

  const theme = useTheme()

  return (
    <Box sx={{minHeight: '57px', display: 'flex', flexDirection: 'row', px: '20px', mt: '4px', fontSize: '13px', fontWeight: 600}}>
      {activeGroup !== undefined && groups[activeGroup].symbols.map((symbol) => {
        return <CompactWatchTab sx={{alignItems: 'center'}} children={
          <>
            <Box>{symbol.symbol}</Box>
            <Box>{symbol?.last}</Box>
            <Box>{symbol?.change}</Box>
          </>
        }/>
      })}
      {activeGroup !== undefined &&
        groups[activeGroup].symbols.length < 10 &&
        <CompactWatchTab
          highlightColor={theme.palette.success.main}
          sx={{
            cursor: 'pointer',
            justifyContent: 'center',
            alignItems: 'center'}}>
          <AddCircleOutlineOutlinedIcon />
        </CompactWatchTab>
      }
    </Box>
  )
}

export default CompactList