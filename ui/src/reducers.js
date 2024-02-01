import {combineReducers} from "@reduxjs/toolkit";

import {default as applicationReducer} from './application/reducer';
import {default as accountReducer} from './account/reducer';
import {default as authenticationReducer} from './authentication/reducer';
import {default as cryptoReducer} from './crypto/reducer';
import {default as stockReducer} from './stock/reducer';

const rootReducer = combineReducers({
  application: applicationReducer,
  authentication: authenticationReducer,
  account: accountReducer,
  crypto: cryptoReducer,
  stock: stockReducer,
})

export default rootReducer;