import {API_ENDPOINT} from "../constants";

export const getClock = () => (dispatch, state, _) => {
  fetch(`${API_ENDPOINT}/clock`)
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