const stockLookup = () => (dispatch, state, _) => {

}

export const symbolLookup = (term) => (dispatch, state, _) => {
  fetch(`api/lookup/stock?q=${term}`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'LOOKUP_ERROR', error: error})
        return
      }

      let securities = json?.securities?.security
      if (typeof securities === 'object' && !Array.isArray(securities)) {
        securities = [securities]
      }
      if (securities && securities.length > 0)
        securities = securities.slice(0,20)

      dispatch({type: 'LOOKUP_RETURN', symbols: securities})
    })
}

export const symbolSearch = (term) => (dispatch, state, _) => {
  fetch(`api/search?q=${term}&greeks=false`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'SEARCH_ERROR', error: error})
        return
      }

      dispatch({type: 'SEARCH_RETURN', activeSymbol: json?.quotes?.quote})
    })
}

export const clearSymbols = () => (dispatch, state, _) => {
  dispatch({type: 'CLEAR_SYMBOL'})
}