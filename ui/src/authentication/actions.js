export const loginUser =
  (data) =>
  (dispatch, state, _) => {
    dispatch({type: 'user_login_requested'})

    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        dispatch({type: 'user_login_completed', ...json})
      })
      .catch(error => {
        dispatch({type: 'user_login_failure', error: error})
      })
}

export const registerUser =
  (data) =>
  (dispatch, state, _) => {
    dispatch({type: 'user_registration_requested'})

    fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        dispatch({type: 'user_logout_completed', ...json})
      })
      .catch(error => {
        dispatch({type: 'user_logout_failure', error: error})
      })
}

export const logout =
  (data) =>
  (dispatch, state, _) => {
    dispatch({type: 'user_logout_requested'})

    fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        dispatch({type: 'user_logout_completed', ...json})
      })
      .catch(error => {
        dispatch({type: 'user_logout_failure', error: error})
      })
}

export const tdVerify = () => {

}

export const refreshAuth = () => {

};