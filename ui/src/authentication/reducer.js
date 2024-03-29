const initialState = {
  supabaseClient: null,
  session: null,
  user: {
    firstName: 'test',
    lastName: 'mctesterson',
    email: 'testEmail@emailer.xyz',
    username: 'test user',
  },
  status: {
    isConnected: false,
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
    case 'user_login_failure':
      return {
        ...state,
        status: {...state.status, isLoggedIn: false}
      }
    case 'td_auth_requested':
    case 'td_verify_requested':
    case 'td_auth_failed':
    case 'td_verify_failed':
      return {...state, status: {...state.status, isConnected: false}}
    case 'td_auth_completed':
    case 'td_verify_completed':
      return {...state, status: {...state.status, isConnected: true}}
    case 'set_session':
      return {...state, session: action.session}
    case 'td_get_token_requested':
    default:
      return state
  }
}

export default reducer;