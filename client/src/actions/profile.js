import axios from "axios";
import { setAlert } from "./alert";
import * as ALERT from "./types";

//get current user profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/profile/me");
        dispatch({
            type: ALERT.GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ALERT.PROFILE_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//create or update profile
export const createProfile = (formData, history, edit = false) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post("/api/profile", formData, config);
        dispatch({
            type: ALERT.GET_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert(edit ? "Profile Updated" : "Profile Created Successfully", "success"));

        if (!edit) {
            history.push("/dashboard");
        }
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "danger"));
            });
        }

        dispatch({
            type: ALERT.PROFILE_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};
