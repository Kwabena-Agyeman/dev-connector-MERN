/** @format */

import axios from "axios";
import { setAlert } from "../Alert/AlertActions";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
} from "./AuthTypes";

import setAuthToken from "../../utils/setAuthToken";

// Load User ****************************************************

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register a user **********************************************

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post("/api/users", body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (error) {
      const err = error.response.data.errors;

      if (err) {
        err.forEach((error) => dispatch(setAlert(err.msg, "danger")));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login a user **********************************************

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post("/api/auth", body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (error) {
      const err = error.response.data.errors;

      if (err) {
        err.forEach((error) => dispatch(setAlert(err.msg, "danger")));
      }

      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
