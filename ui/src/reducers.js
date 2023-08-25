import {combineReducers} from "@reduxjs/toolkit";

import {default as userReducer} from './account/reducer';
import {default as authenticationReducer} from './authentication/reducer';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  user: userReducer,
})

export default rootReducer;