const initialState = {
  clock: {},
  page: 'main'
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
    default:
      return state
  }
}

export default reducer