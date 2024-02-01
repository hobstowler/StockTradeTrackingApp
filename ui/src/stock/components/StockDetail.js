import {useSelector} from "react-redux";
import {Box, Container, useTheme} from "@mui/system";
import {Grid} from "@mui/material";
import {useEffect, useState} from "react";


const Item = (props) => {
  const {starttext = '', endtext = '', item, width = 1, currency = true} = props
  const [text, setText] = useState('')

  useEffect(() => {
    if (item === undefined || item === null) {
      setText('null')
      return
    }

    let newText = ''
    if (currency) {
      newText = item.toLocaleString("en-US", {style:"currency", currency:"USD"})
    } else {
      newText = item
    }

    setText(`${starttext}${newText}${endtext}`)
  }, [item])
  return (
    <Grid {...props} item xs={width}>{text}</Grid>
  )
}

const StockDetail = () => {
  const [pctChange, setPctChange] = useState(false)
  const stock = useSelector(({stock}) => stock.activeSymbol)
  const theme = useTheme()
  console.log(stock)

  const togglePctChange = () => {
    setPctChange(!pctChange)
  }

  if (Object.keys(stock).length === 0) return

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '12px',
          border: '1px solid black',
          my: '12px',
          p: '4px'
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Item starttext='( Prev ' endtext=' )' item={stock?.prevclose} />
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Item sx={{borderRight: '2px solid black', pr: '12px'}} starttext='Open ' item={stock?.open} />
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '2px', justifyContent: 'start'}}>
          <Item sx={{color: theme.palette.success.main}} text='High: ' item={stock?.high} />
          <Box onClick={togglePctChange}  sx={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
            <Item text='Last: ' item={stock?.last} />
            <Item
              starttext='( '
              item={pctChange ? stock?.change_percentage : stock?.change}
              currency={!pctChange}
              endtext={pctChange ? '% )' : ')'}
              sx={{
                color: stock?.change > 0 ? theme.palette.success.main : theme.palette.error.main
              }}
            />
          </Box>
          <Item sx={{color: theme.palette.warning.main}} item={stock?.low} />
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Item sx={{borderLeft: '2px solid black', pl: '12px'}} endtext='Close' item={stock?.close} />
        </Box>
      </Box>
    </Container>
  )

}

export default StockDetail