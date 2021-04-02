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
