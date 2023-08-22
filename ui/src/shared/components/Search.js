import {Button, TextField} from "@mui/material";
import {Box} from "@mui/system";

const Search = ({ setResult, helperText, buttonText = 'Search' }) => {
  return(
    <Box sx={{display: 'flex', mt: '10px'}}>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" sx={{mr: '10px'}}/>
      <Button variant='contained'>{buttonText}</Button>
    </Box>
  )
}

export default Search;