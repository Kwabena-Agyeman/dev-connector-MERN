/** @format */

import { combineReducers } from "redux";
import AlertReducer from "./Alert/AlertReducer";
import AuthReducer from "./Auth/AuthReducer";

export default combineReducers({
  AlertReducer,
  AuthReducer,
});
