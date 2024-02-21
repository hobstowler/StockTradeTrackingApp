import {configureStore} from "@reduxjs/toolkit";

import rootReducer from './reducers'

const store = (extraArg) => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: {
          extraArgument: extraArg
        }
      })
  })
}

export default store;