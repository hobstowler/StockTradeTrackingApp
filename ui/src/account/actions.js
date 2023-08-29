export const loadAccounts =
  () =>
  (dispatch, state, _) => {
    dispatch({ type: 'all_account_initial_load_requested' })

    fetch('/account/')
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const json = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (json && json.error) || response.status
          dispatch({type: 'all_account_load_error', error: error})
        }

        console.log(json)
        dispatch({type: 'all_account_load_completed', accounts: json})
      }
    )
  }

export const loadAccount =
  (accountId) =>
  (dispatch, state, _) => {
    dispatch({ type: 'account_refresh_requested' })

    fetch(`/account/${accountId}`)
      .then(async response => {
        const hasJson = response.headers.get('content-type')?.includes('application/json')
        const json = hasJson ? await response.json() : null

        if (!response.ok) {
          let error = (json && json.error) || response.status
          dispatch({type: 'all_account_load_error', error: error})
        }

        dispatch({type: 'account_load_completed', transactions: json})
      }
    )
  }

export const loadAccountTransactions =
  (accountId) =>
  (dispatch, state, _) => {
    dispatch({type: 'load_transactions_requested'})

    fetch(`/account/${accountId}/transactions`)
      .then(async response => {
          const hasJson = response.headers.get('content-type')?.includes('application/json')
          const json = hasJson ? await response.json() : null

          if (!response.ok) {
            let error = (json && json.error) || response.status
            dispatch({type: 'load_transactions_failed', error: error})
          }

          dispatch({type: 'load_transactions_completed', transactions: json})
        }
      )
  }