const initialState = {
  currentStock: {},
  activeSymbol: null,
  searchSymbol: null,
  watchList: {
    groups: [
      {
        name: 'AI',
        symbols: [
          {symbol: 'SMCI'},
          {symbol: 'ARM'},
          {symbol: 'AMAT'},
          {symbol: 'META'},
          {symbol: 'AMD'},
          {symbol: 'BMR'},
          {symbol: 'MSFT'},
          {symbol: 'ROKU'},
          {symbol: 'DKNG'},
          {symbol: 'NVDA'}
        ]
      },
      {
        name: 'Fintech',
        symbols: [
          {symbol: 'JPM'}
        ]
      }
    ]
  },
  lookupSymbols: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOOKUP_RETURN':
      return {
        ...state,
        lookupSymbols: action.symbols || []
      }
    case 'CLEAR_SYMBOLS':
      return {
        ...state,
        lookupSymbols: []
      }
    case 'SET_ACTIVE_WATCH_GROUP':
      return {
        ...state,
        watchList: {
          ...state.watchList,
          activeGroup: action.groupName
        }
      }
    case 'SET_SEARCH_SYMBOL':
      return {
        ...state,
        searchSymbol: action.searchSymbol || {}
      }
    case 'SET_ACTIVE_SYMBOL':
      return {
        ...state,
        activeSymbol: action.activeSymbol || {}
      }
    case 'LOAD_WATCHLIST_START':
      return {
        ...state,
        watchList: {
          ...state.watchList,
          loaded: false
        }
      }
    case 'UPDATE_WATCHLIST':
      let newGroups = state.watchList.groups.map((group, i) => {
        return i === action.groupName ? {...group, symbols: action.quotes} : group
      })

      return {
        ...state,
        watchList: {
          ...state.watchList,
          loaded: action.loaded,
          groups: newGroups
        }
      }
    case 'REFRESH_WATCHLIST':
      console.log(state.watchList.groups)
      console.log(action.groups)
      return {
        ...state,
        watchList: {
          ...state.watchList,
          loaded: true,
          groups: [...action.groups]
        }
      }
    default:
      return state;
  }
}

export default reducer;