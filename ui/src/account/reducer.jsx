const initialState = {
  connected: false,
  loggedIn: false ,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'logIn':
      return { ...state, loggedIn: true }
    default:
      return state
  }
}