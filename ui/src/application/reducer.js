const initialState = {
  clock: null,
  page: 'main',
  streaming: {
    account: true,
    market: true
  },
  darkMode: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CLOCK_ERROR':
      return {
        ...state,
        error: action.error
      }
    case 'SET_CLOCK':
      return {
        ...state,
        clock: {...action.clock}
      }
    case 'SET_PAGE':
      return {
        ...state,
        page: action.pageName
      }
    case 'SET_MARKET_STREAM':
      return {
        ...state,
        streaming: {
          ...state.streaming,
          market: action.state
        }
      }
    case 'SET_ACCOUNT_STREAM':
      return {
        ...state,
        streaming: {
          ...state.streaming,
          account: action.state
        }
      }
    case 'SET_DARK_MODE':
      return {
        ...state,
        darkMode: action.darkMode
      }
    default:
      return state
  }
}

export default reducer