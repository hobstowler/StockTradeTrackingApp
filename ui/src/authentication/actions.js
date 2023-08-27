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
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const json = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (json && json.error) || response.status
          dispatch({type: 'user_login_failure', error: error})
        }

        dispatch({type: 'user_login_completed', ...json})
      })
}

export const testDisp = () => {
  console.log('test')
}

export const registerUser =
  (data) =>
  (dispatch, state, _) => {
    dispatch({type: 'user_registration_requested'})
    console.log('registering')

    fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true'
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

export const disconnect =
  () =>
  (dispatch, state, _) => {
    dispatch({type: 'user_disconnect_requested'})

    fetch('/auth/disconnect', {method: 'POST'})
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const json = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (json && json.error) || response.status
          console.log(error)
        }
      })
}

export const tdConnect =
  () =>
  (dispatch, state, _) => {
  dispatch({type: 'td_connect_requested'})
    console.log(`/auth/td_auth?url=${window.location.host}`)
  fetch(`/auth/td_auth?url=${window.location.host}`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'td_connect_failed', error: error})
      }

      if (json.redirect) {
        window.location.href = json.redirect
      }
      dispatch({type: 'td_connect_no_redirect'})
    })
}

export const tdReturnAuth = (code) =>
  (dispatch, state, _) => {
  dispatch({type: 'td_auth_requested'})

  fetch(`/auth/td_return_auth?code=${code}`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'td_auth_failed', error: error})
      }

      dispatch({type: 'td_auth_completed'})
      // window.location.href = '/'
    })
}

export const tdVerify = () =>
  (dispatch, state, _) => {
  dispatch({ type: 'td_verify_requested'})
  fetch('/auth/verify_td')
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const data = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (data && data.error) || response.status
        dispatch({ type: 'td_verify_failed' })
      }

      dispatch({ type: 'td_verify_completed' })
    })
}

export const refreshAuth = () => {

};