const initialState = {
  clock: {}
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
    default:
      return state
  }
}

export default reducer