/** @format */

import axios from "axios";
import { set } from "mongoose";
import { setAlert } from "../Alert/AlertActions";
import { REGISTER_FAIL, REGISTER_SUCCESS } from "./AuthTypes";

// Register a user

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
