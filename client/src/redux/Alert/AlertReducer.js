/** @format */

import { REMOVE_ALERT, SET_ALERT } from "./AlertConstants";

const initialState = [];

const AlertReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return [];
    default:
      return state;
  }
};

export default AlertReducer;
