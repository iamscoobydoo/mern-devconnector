import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import * as ALERT from "./types";

//load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get("/api/auth");
        dispatch({
            type: ALERT.USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ALERT.AUTH_ERROR,
        });
    }
};

//register user
export const register = ({ name, email, password }) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post("./api/users", body, config);
        dispatch({
            type: ALERT.REGISTER_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "danger"));
            });
        }
        dispatch({
            type: ALERT.REGISTER_FAILURE,
        });
    }
};

//login user
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post("./api/auth", body, config);
        dispatch({
            type: ALERT.LOGIN_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "danger"));
            });
        }
        dispatch({
            type: ALERT.LOGIN_FAILURE,
        });
    }
};

//logout / clear profile
export const logout = () => (dispatch) => {
    dispatch({
        type: ALERT.LOGOUT,
    });
};
