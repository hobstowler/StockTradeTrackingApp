const initialState = {
  currentStock: {},
  watchList: {
    activeSymbol: '',
    activeGroup: undefined,
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
          {
            symbol: 'JPM'
          }
        ]
      }
    ]
  },
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
    case 'SET_ACTIVE_WATCH_GROUP':
      return {
        ...state,
        watchList: {
          ...state.watchList,
          activeGroup: action.groupName
        }
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
    default:
      return state;
  }
}

export default reducer;