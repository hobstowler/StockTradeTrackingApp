import {Box, useTheme} from "@mui/system";
import {useSelector} from "react-redux";
import CompactWatchTab from "./CompactWatchTab";

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Item from "../../shared/components/Item";

const CompactList = () => {
  const {groups, activeGroup} = useSelector(({stock}) => stock.watchList)

  const theme = useTheme()

  return (
    <Box sx={{
      minHeight: '57px',
      display: 'flex',
      flexDirection: 'row',
      px: '20px',
      mt: '4px',
      fontSize: '13px',
      fontWeight: 600
    }}>
      {activeGroup !== null && groups[activeGroup].symbols.map((symbol) => {
        return <CompactWatchTab sx={{alignItems: 'center'}} symbol={symbol} children={
          <>
            <Box>{symbol.symbol}</Box>
            <Item item={symbol?.last}/>
            <Item item={symbol?.change}/>
          </>
        }/>
      })}
      {activeGroup !== null &&
        groups[activeGroup].symbols.length < 10 &&
        <CompactWatchTab
          highlightColor={theme.palette.success.main}
          sx={{
            cursor: 'pointer',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <AddCircleOutlineOutlinedIcon/>
        </CompactWatchTab>
      }
    </Box>
  )
}

export default CompactList