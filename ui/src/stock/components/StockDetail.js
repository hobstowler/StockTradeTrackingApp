import {useSelector} from "react-redux";
import {Box, Container, useTheme} from "@mui/system";
import {useState} from "react";
import Item from "../../shared/components/Item";
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import {Divider} from "@mui/material";


const StockDetail = () => {
  const [pctChange, setPctChange] = useState(false)
  const stock = useSelector(({stock}) => stock.activeSymbol)
  const theme = useTheme()

  const up = theme.palette.success.main
  const down = theme.palette.error.main

  const lastColor = () => {
    if (stock?.last > stock?.open) return up
    if (stock?.last < stock?.open) return down
    return 'inherit'
  }

  const changeColor = () => {

  }

  const togglePctChange = () => {
    setPctChange(!pctChange)
  }

  if (!stock || Object.keys(stock).length === 0) return

  return (
    <Container disableGutters>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: theme.palette.grey[50],
          flexGrow: 1,
          gap: '20px',
          py: '12px',
          p: '4px'
        }}
      >
        <Box sx={{display: 'flex', lineHeight: '1.1', flexDirection: 'column', alignItems: 'end', fontSize: '13px'}}>
          {/*<Box sx={{fontWeight: 700}}>Last:</Box>*/}
          <Box sx={{fontWeight: 600, fontSize: '28px', color: lastColor()}}>
            <Item item={stock?.last} />
          </Box>
          <Box sx={{color: stock?.change < 0 ? down : (stock !== 0 ? up : 'inherit')}}>
            <Item item={pctChange ? stock.change_percentage : stock.change} currency={!pctChange}/>
          </Box>
        </Box>
        <Box sx={{mt: '4px', fontSize: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <NorthOutlinedIcon color='success' fontSize='xs'/>
            </Box>
            <Box><Item item={stock?.high || stock?.close || '0'}/></Box>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last <= stock?.low ? down : 'inherit'}}>
            <Box sx={{display: 'flex', alignItems: 'end'}}>
              <SouthOutlinedIcon color='error' fontSize='xs' />
            </Box>
            <Box><Item item={stock?.low || '0'} /></Box>
          </Box>
        </Box>
        <Box sx={{mt: '4px', fontSize: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Box><Item item={stock?.week_52_high} /></Box>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last <= stock?.low ? down : 'inherit'}}>
            <Box><Item item={stock?.week_52_low} /></Box>
          </Box>
        </Box>
        <Box sx={{mt: '4px', fontSize: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Box><Item item={stock?.volume} currency={false} /></Box>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Box><Item item={stock?.last_volume} currency={false} /></Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )

}

export default StockDetail