const initialState = {
  activeAccount: {},
  accounts: [],
}

const reducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'all_account_load_completed':
      return {
        ...state,
        activeAccount: action.accounts[0],
        accounts: action.accounts,
      }
    case 'load_transactions_completed':
      return {
        ...state,
        transactions: action.transactions,
      }
    default:
      return {...state}
  }
}

export default reducer;