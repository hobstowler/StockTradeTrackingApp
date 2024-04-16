import {Box} from "@mui/system";
import {Grid} from "@mui/material";

const GridColumn = ({children, headerText, headerDecoration = 'underline'}) => {
  return (
    <Grid
      item
      xs={2}
      sx={{
        lineHeight: '1.1',
        alignItems: 'end',
        fontSize: '16px',
        display: 'flex',
        gap: '4px',
        px: '8px',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          fontWeight: 600,
          textAlign: 'right',
          fontSize: '13px',
          mb: '2px',
          textDecoration: headerDecoration
        }}
      >
        {headerText}
      </Box>
      {children}
    </Grid>
  )
}

export default GridColumn