import {Box, useTheme} from "@mui/system";
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const StockKeyIndicators = () => {
  const theme = useTheme()
  const indicators = [
    'a', 'b', 'c',
    'a', 'b', 'c'
  ]

  return (
    <Box sx={{display: 'flex', borderRight: `2px solid ${theme.palette.grey[100]}`}}>
      {indicators.map((indicator, i) => {
        return (
          <Box
            key={i}
            sx={{
              px: '12px',
              py: '4px',
              borderLeft: `2px solid ${theme.palette.grey[100]}`,
            }}
          >
            <NewReleasesIcon />
          </Box>
        )
      })}
    </Box>
  )
}

export default StockKeyIndicators