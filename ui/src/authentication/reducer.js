const initialState = {
  status: {
    isLoaded: true,
    isLoggedIn: false,
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
    default:
      return state
  }
}

export default reducer;