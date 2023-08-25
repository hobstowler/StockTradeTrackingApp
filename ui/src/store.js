import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers'

const store = (extraArgs) => {
  return configureStore({
    reducer: rootReducer,
    middleware: [thunkMiddleware.withExtraArgument(extraArgs)]
  })
}

export default store;