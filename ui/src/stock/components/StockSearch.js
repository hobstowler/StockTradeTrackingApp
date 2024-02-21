import {Box, Container} from "@mui/system";
import {Autocomplete, Button, TextField} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {symbolLookup, symbolSearch} from "../actions";

const StockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputVal, setInputVal] = useState('')
  const symbols = useSelector(({stock}) => stock.lookupSymbols)
  const activeSymbol = useSelector(({stock}) => stock?.activeSymbol)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  let input = searchTerm

  useEffect(() => {
    if (searchTerm === '') return
    const delayLookupFn = setTimeout(() => {
      dispatch(symbolLookup(searchTerm))
    }, 1000)

    return () => clearTimeout(delayLookupFn)
  }, [searchTerm])

  useEffect(() => {
    if (symbols.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [symbols])

  useEffect(() => {
    if (Object.keys(activeSymbol).length === 0) return
    setInputVal(`${activeSymbol.symbol} - ${activeSymbol.description}`)
  }, [activeSymbol])

  const handleSearch = (symbol) => {
    if (symbol?.symbol === undefined) return

    setOpen(false)
    dispatch(symbolSearch(symbol.symbol))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setOpen(false)
    dispatch(symbolSearch(searchTerm))
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
            onChange={(_, option) => handleSearch(option)}
            onInputChange={(_, val) => setInputVal(val)}
            renderInput={
              (params) =>
                <TextField
                  onBlur={() => setOpen(false)}
                  onFocus={() => {
                    console.log(symbols);
                    setOpen(true)
                  }}
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
            <Button disabled={!Object.keys(activeSymbol).length > 0}>Add to WatchList</Button>
            <Button type='submit'>Search</Button>
          </Box>
        </Container>
      </form>
    </Box>
  )
}

export default StockSearch