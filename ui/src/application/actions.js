import {TRADIER_API_ENDPOINT} from "../constants";

export const getClock = () => (dispatch, state, _) => {
  const token = state().authentication.session?.access_token

  if (token === undefined || token === null) return

  fetch(`${TRADIER_API_ENDPOINT}/clock`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async response => {
      const hasJson = response.headers.get('content-type')?.includes('application/json')
      const json = hasJson ? await response.json() : null

      if (!response.ok) {
        let error = (json && json.error) || response.status
        dispatch({type: 'SET_CLOCK_ERROR', error: error})
        return
      }

      dispatch({type: 'SET_CLOCK', ...json})
    })
}

export const setPage = (pageName) => (dispatch, state, _) => {
  dispatch({type: 'SET_PAGE', pageName: pageName})
}

export const setMarketStream = (stateVal) => (dispatch, state, _) => {
  dispatch({type: 'SET_MARKET_STREAM', state: stateVal})
}

export const setAccountStream = (stateVal) => (dispatch, state, _) => {
  dispatch({type: 'SET_ACCOUNT_STREAM', state: stateVal})
}

export const setDarkMode = (modeVal) => (dispatch, state, _) => {
  dispatch({type: 'SET_DARK_MODE', darkMode: modeVal})
}