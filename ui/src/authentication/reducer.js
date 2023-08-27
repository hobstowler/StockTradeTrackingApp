const initialState = {
  username: 'test user',
  status: {
    isConnected: false,
    isLoaded: true,
    isLoggedIn: true,
    processing: false,
  }
}

const updateStatus = (state = initialState.status, action) => {
  switch (action.type) {
    case 'user_login_requested':
      return {
        ...state,
        processing: true,
      };
    case 'user_login_completed':
      return {
        ...state,
        processing: false,
      };
    default:
      return state;
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'user_login_requested':
    case 'user_login_completed':
      return {
        ...state,
        status: updateStatus(state.status, action),
      };
    case 'td_auth_requested':
      return {...state, status: {...state.status, isConnected: true}}
    default:
      return state
  }
}

export default reducer;