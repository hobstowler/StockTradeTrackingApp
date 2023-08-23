import {Button, TextField} from "@mui/material";
import {Box} from "@mui/system";
import { useState} from "react";

const Search = ({ setSearchValue = () => {}, helperText, buttonText = 'Search' }) => {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    console.log(e.target.value)
    setValue(e.target.value)
  }

  const handleSearch = () => {
    console.log(value)
    setSearchValue(value)
  }

  return(
    <Box sx={{display: 'flex', mt: '10px'}}>
      <TextField
        id="outlined-basic"
        label={helperText}
        variant="outlined"
        size="small"
        sx={{mr: '10px'}}
        onChange={handleChange}
      />
      <Button variant='contained' onClick={handleSearch}>{buttonText}</Button>
    </Box>
  )
}

export default Search;