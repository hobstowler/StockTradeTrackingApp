const initialState = {
  currentStock: {},
  watchList: {},
  lookupSymbols: [],
  activeSymbol: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOOKUP_RETURN':
      return {
        ...state,
        lookupSymbols: action.symbols || []
      }
    case 'SEARCH_RETURN':
      return {
        ...state,
        activeSymbol: action.activeSymbol || {}
      }
    case 'CLEAR_SYMBOLS':
      return {
        ...state,
        lookupSymbols: []
      }
    default:
      return state;
  }
}

export default reducer;