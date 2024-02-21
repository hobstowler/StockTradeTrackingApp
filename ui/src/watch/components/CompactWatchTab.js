import {Box, useTheme} from "@mui/system";

const CompactWatchTab = (props) => {
  const theme = useTheme()

  return (
    <Box
      {...props}
      sx={{
        ...props.sx,
        px: '1px',
        py: '12px',
        minWidth: '60px',
        maxWidth: '60px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.grey[100],
        '&:hover': {
          backgroundColor: theme.palette.grey[200],
          color: props.highlightColor || 'inherit'
        },
        mx: '1px',
        my: '4px'}}>
      {props.children}
    </Box>)
}

export default CompactWatchTab