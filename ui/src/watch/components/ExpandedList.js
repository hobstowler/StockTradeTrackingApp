import {Grid} from "@mui/material";
import {useSelector} from "react-redux";

const ExpandedList = ({}) => {
  const {groups, activeGroup} = useSelector(({stock}) => stock.watchList)

  return (
    <Grid
      container
      columns={10}
      sx={{
        display: 'flex',
        flexGrow: 1,
        m: '12px',
        p: '12px',
        fontSize: '13px'
      }}
    >
      <Grid container spacing={8} xs={12} sx={{fontWeight: 700, mb: '4px'}}>
        <Grid item xs={1}>Symbol</Grid>
        <Grid item xs={1}>Prev</Grid>
        <Grid item xs={1}>Open</Grid>
        <Grid item xs={1}>Low</Grid>
        <Grid item xs={1}>Last</Grid>
        <Grid item xs={1}>Change</Grid>
        <Grid item xs={1}>High</Grid>
        <Grid item xs={1}>Bid/Ask</Grid>
        <Grid item xs={1}>Volume</Grid>
        <Grid item xs={1}>Close</Grid>
      </Grid>
      {activeGroup !== undefined && groups[activeGroup].symbols.map((symbol, i) => {
        return (
          <Grid container spacing={8} xs={12} sx={{style: {backgroundColor: i % 2 === 0 ? 'red' : 'inherit'}}}>
            <Grid item xs={1}>{symbol.symbol}</Grid>
            <Grid item xs={1}>{symbol.prevclose}</Grid>
            <Grid item xs={1}>{symbol.open}</Grid>
            <Grid item xs={1}>{symbol.low}</Grid>
            <Grid item xs={1}>{symbol.last}</Grid>
            <Grid item xs={1}>{symbol.change}</Grid>
            <Grid item xs={1}>{symbol.high}</Grid>
            <Grid item xs={1}>{symbol.bid}</Grid>
            <Grid item xs={1}>{symbol.ask}</Grid>
            <Grid item xs={1}>{symbol.change}</Grid>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ExpandedList