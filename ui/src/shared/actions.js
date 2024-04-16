import {Box, useTheme} from "@mui/system";

export const useFormatStatus = (marketStatus) => {
  const theme = useTheme()
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