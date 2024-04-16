import {TRADIER_API_ENDPOINT} from "../constants";

const stockLookup = () => (dispatch, state, _) => {

}

export const symbolLookup = (term) => (dispatch, state, _) => {
  fetch(`${TRADIER_API_ENDPOINT}/symbol/stock?q=${term}`)
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
  fetch(`${TRADIER_API_ENDPOINT}/quote?q=${term}&greeks=false`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'SEARCH_ERROR', error: error})
        return
      }

      const quote = json?.quotes?.quote

      dispatch(setSearchSymbol(quote))
      dispatch(setActiveSymbol(quote))
    })
}

export const clearSymbols = () => (dispatch, state, _) => {
  dispatch({type: 'CLEAR_SYMBOL'})
}

export const setActiveGroup = (groupName) => (dispatch, state, _) => {
  dispatch({type: 'SET_ACTIVE_WATCH_GROUP', 'groupName': groupName})
}

export const setActiveSymbol = (symbol) => (dispatch, state, _) => {
  dispatch({type: 'SET_ACTIVE_SYMBOL', activeSymbol: symbol})
}

export const setSearchSymbol = (symbol) => (dispatch, state, _) => {
  dispatch({type: 'SET_SEARCH_SYMBOL', searchSymbol: symbol})
}

export const refreshActiveWatchList = (groupName, refresh = false) => (dispatch, state, _) => {
  if (!refresh) {
    dispatch({type: 'LOAD_WATCHLIST_START'})
  }
  const symbols = state().stock.watchList.groups?.[groupName].symbols.map((symbol) => {return symbol.symbol})

  fetch(`${TRADIER_API_ENDPOINT}/quote?q=${symbols.toString()}&greeks=false`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'UPDATE_WATCHLIST_ERROR', error: error})
        return
      }

      let quotes = json?.quotes?.quote
      if (typeof quotes === 'object') {
        if (!Array.isArray(quotes)) {
          quotes = [quotes]
        }
      } else {
        dispatch({type: 'UPDATE_WATCHLIST_ERROR', error: 'error'})
      }

      dispatch({type: 'UPDATE_WATCHLIST', loaded: true, groupName: groupName, quotes: quotes})
    })
}

export const refreshEverything = () => (dispatch, getState, _) => {
  const state = getState()

  const token = state.authentication?.session?.access_token

  if (token === undefined || token === null) {
    console.log('bad token')
    return
  }

  const watchSymbols = state.stock.watchList.groups.map((group) => group.symbols.map((symbol) => symbol.symbol))
  const symbols = [
    ...new Set([
      watchSymbols.flat(),
      state.stock.activeSymbol?.symbol,
      state.stock.searchSymbol?.symbol
    ])
  ]

  fetch(`${TRADIER_API_ENDPOINT}/quote?q=${symbols.toString()}&greeks=false`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'REFRESH_ERROR', error: error})
        return
      }

      let quotes = json?.quotes?.quote
      if (typeof quotes !== 'object') {
        dispatch({type: 'REFRESH_ERROR', error: 'error'})
        return
      }
      if (!Array.isArray(quotes)) quotes = [quotes]

      for (const quote of quotes) {
        if (quote.symbol === state.stock.activeSymbol?.symbol) {
          dispatch(setActiveSymbol(quote))
        }
        if (quote.symbol === state.stock.searchSymbol?.symbol) {
          dispatch(setSearchSymbol(quote))
        }

        for (const group of watchSymbols) {
          const idx = group.indexOf(quote.symbol)
          if (idx !== -1) {
            group[idx] = quote
          }
        }
      }
      const newGroups = []
      watchSymbols.forEach((group, i) => {
        newGroups.push({
          ...state.stock.watchList.groups[i],
          symbols: group
        })
      })
      dispatch({type: 'REFRESH_WATCHLIST', groups: newGroups})
    })
}