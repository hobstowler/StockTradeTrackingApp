import {Box, useTheme} from "@mui/system";

const StockGraph = () => {
  const theme = useTheme()

  return (
    <Box sx={{border: `1px solid ${theme.palette.grey[500]}`, minHeight: '400px', minWidth: '100%'}}>

    </Box>
  )
}

export default StockGraph