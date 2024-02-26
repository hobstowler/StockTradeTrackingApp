import {Box, Container} from "@mui/system";
import {Autocomplete, Button, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {symbolLookup, symbolSearch} from "../actions";

const StockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputVal, setInputVal] = useState('')
  const symbols = useSelector(({stock}) => stock.lookupSymbols)
  const searchSymbol = useSelector(({stock}) => stock?.searchSymbol)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (searchTerm === '') return
    const delayLookupFn = setTimeout(() => {
      dispatch(symbolLookup(searchTerm))
    }, 1000)

    return () => clearTimeout(delayLookupFn)
  }, [searchTerm])

  useEffect(() => {
    if (!searchSymbol || Object.keys(searchSymbol).length === 0) return
    setInputVal(`${searchSymbol.symbol} - ${searchSymbol.description}`)
  }, [searchSymbol])

  const handleSearch = (symbol) => {
    if (symbol?.symbol === undefined || symbol?.symbol === '') return

    setOpen(false)
    dispatch(symbolSearch(symbol.symbol))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.length === 0) return

    setOpen(false)
    dispatch(symbolSearch(searchTerm))
  }

  const handleChange = (_, option) => {
    handleSearch(option)
  }
  const handleInputChange = (_, val, reason) => {
    if (reason === 'clear') {
      setSearchTerm('')
      setOpen(false)
    }
    setInputVal(val)
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <form onSubmit={handleSubmit}>
        <Container sx={{display: 'flex', flexDirection: {xs: 'row', lg: 'column'}, mt: '12px', alignItems: 'end', gap: '4px'}}>
          <Autocomplete
            open={open}
            disablePortal
            freeSolo
            options={symbols || []}
            inputValue={inputVal}
            variant='standard'
            getOptionLabel={(option) => option?.symbol ? `${option.symbol} - ${option.description}` : ''}
            onChange={handleChange}
            onInputChange={handleInputChange}
            renderInput={
              (params) =>
                <TextField
                  onBlur={() => setOpen(false)}
                  onFocus={() => setOpen(true)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  variant='standard'
                  sx={{minWidth: '400px', mr: '20px'}}
                  {...params}
                  label={'Symbol Lookup'}
                />
            }
          />
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
            <Button disabled={!searchSymbol || !Object.keys(searchSymbol).length > 0}>Add to WatchList</Button>
            <Button type='submit' disabled={searchTerm.length === 0}>Search</Button>
          </Box>
        </Container>
      </form>
    </Box>
  )
}

export default StockSearch