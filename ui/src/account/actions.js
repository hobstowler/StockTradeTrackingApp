export const loadAccounts =
  () =>
  (dispatch, {account}, _) => {
    if (account.positions) {
      dispatch({ type: 'all_account_refresh_requested' })
    } else {
      dispatch({ type: 'all_account_initial_load_requested' })
    }

    fetch('/account/')
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const json = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (json && json.error) || response.status
          dispatch({type: 'all_account_load_error', error: error})
        }

        dispatch({type: 'all_account_load_completed', ...json})
      })
  }

export const loadAccount =
  (accountId) =>
  (dispatch, {account}, _) => {
    if (account.positions) {
      dispatch({ type: 'account_refresh_requested' })
    } else {
      dispatch({ type: 'account_initial_load_requested' })
    }

    fetch(`/account/${accountId}`)
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const json = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (json && json.error) || response.status
          dispatch({type: 'all_account_load_error', error: error})
        }

        dispatch({type: 'account_load_completed', ...json})
      })
  }