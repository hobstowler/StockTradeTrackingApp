import {combineReducers} from "@reduxjs/toolkit";

import {default as userReducer} from './account/reducer'

const rootReducer = combineReducers({
  user: userReducer,
})

export default rootReducer;