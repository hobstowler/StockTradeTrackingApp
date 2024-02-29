import {useSelector} from "react-redux";
import {Box, Container, useTheme} from "@mui/system";
import {useState} from "react";
import Item from "../../shared/components/Item";
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import {Divider, Grid, Tooltip} from "@mui/material";
import GridColumn from "../../shared/components/GridColumn";


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
      <Grid
        container
        columns={9}
        xs={9}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: theme.palette.grey[50],
          flexGrow: 1,
          py: '12px',
          p: '4px'
        }}
      >
        <Grid xs={3} sx={{display: 'flex', lineHeight: '1.1', flexDirection: 'column', alignItems: 'end', fontSize: '13px', px: '8px'}}>
          {/*<Box sx={{fontWeight: 700}}>Last:</Box>*/}
          <Tooltip title={stock?.description} placement='top' arrow>
            <Box sx={{fontWeight: 600}}>{stock?.symbol}</Box>
          </Tooltip>
          <Box sx={{fontWeight: 600, fontSize: '28px', color: lastColor()}}>
            <Item item={stock?.last} />
          </Box>
          <Box sx={{color: stock?.change < 0 ? down : (stock !== 0 ? up : 'inherit')}}>
            <Item item={pctChange ? stock.change_percentage : stock.change} currency={!pctChange}/>
          </Box>
        </Grid>
        <GridColumn headerText='High/Low'>
          <Box sx={{display: 'flex', alignItems: 'end', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <NorthOutlinedIcon color='success' fontSize='xs'/>
            <Item item={stock?.high || stock?.close || '0'}/>
          </Box>
          <Box sx={{display: 'flex', alignItems: 'end', flexDirection: 'row', gap: '2px', color: stock?.last <= stock?.low ? down : 'inherit'}}>
            <SouthOutlinedIcon color='error' fontSize='xs' />
            <Item item={stock?.low || '0'} />
          </Box>
        </GridColumn>
        <GridColumn headerText='52 Week'>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Item item={stock?.week_52_high} />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last <= stock?.low ? down : 'inherit'}}>
            <Item item={stock?.week_52_low} />
          </Box>
        </GridColumn>
        <GridColumn headerText='Volume'>
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Item item={stock?.volume} currency={false} />
          </Box>
          <Box sx={{display: 'flex',flexDirection: 'row', gap: '2px', color: stock?.last >= stock?.high ? up : 'inherit'}}>
            <Item item={stock?.last_volume} currency={false} />
          </Box>
        </GridColumn>
      </Grid>
    </Container>
  )

}

export default StockDetail