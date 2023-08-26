import {combineReducers} from "@reduxjs/toolkit";

import {default as accountReducer} from './account/reducer';
import {default as authenticationReducer} from './authentication/reducer';
import {default as cryptoReducer} from './crypto/reducer'

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  account: accountReducer,
  crypto: cryptoReducer,
})

export default rootReducer;