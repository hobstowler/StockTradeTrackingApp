import {display} from "@mui/system";

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
          return
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

export const logoutUser =
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
          dispatch({type: 'user_disconnect_failed', error: error})
          return
        }

        window.location.href = json.redirect ? json.redirect : '/'
      })
}

export const tdConnect =
  () =>
  (dispatch, state, _) => {
  dispatch({type: 'td_connect_requested'})

  fetch(`/auth/td_auth?url=${window.location.host}`)
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'td_connect_failed', error: error})
        return
      }

      window.location.href = json.redirect ? json.redirect : '/'
    })
}

export const tdGetToken = (code) =>
  async (dispatch, state, _) => {
  dispatch({type: 'td_get_token_requested'})

  const body = {
    "grant_type": "authorization_code",
    "access_type": "offline",
    "code": code,
    "client_id": "WKARA9UYSUE8NO3FQMXCSGE5HSNG5RML@AMER.OAUTHAP",
    "redirect_uri": `https://${window.location.host}/auth/td_return_auth`,
  }
  let formBody = []
  for (const property in body) {
    const encodedKey = encodeURIComponent(property)
    const encodedValue = encodeURIComponent(body[property])
    formBody.push(`${encodedKey}=${encodedValue}`)
  }
  formBody = formBody.join('&')

  fetch("https://api.tdameritrade.com/v1/oauth2/token", {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formBody
  }).then(async response => {
    const hasJson = response.headers.get('content-type')?.includes('application/json')
    const json = hasJson ? await response.json() : null

    if (!response.ok) {
      let error = (json && json.error) || response.status
      dispatch({type: 'td_get_token_failed'})
      return
    }
    console.log('bueno')
    console.log(json)
    dispatch({type: 'td_get_token_completed'})
    dispatch(tdPushToken(json))
  })
}

const tdPushToken = (token) =>
  (dispatch, state, _) => {
    console.log('pushing')
    console.log(token)
    dispatch({type: 'td_token_push_requested'})

    fetch('/auth/td_push_token', {
      method: 'POST',
      body: JSON.stringify({...token}),
    }).then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'td_token_push_failed'})
        return
      }
      dispatch({type: 'td_token_push_completed'})
      // window.location.href = '/'
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
        return
      }

      dispatch({type: 'td_auth_completed'})
      window.location.href = '/'
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
        dispatch({ type: 'td_verify_failed', error: error })
        return
      }

      dispatch({ type: 'td_verify_completed' })
    })
}

export const refreshAuth = () => {

};