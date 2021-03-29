import * as ALERT from "../actions/types";
import { v4 as uuidv4 } from "uuid";

export const setAlert = (msg, alertType, timeout = 2500) => (dispatch) => {
    const id = uuidv4();
    dispatch({
        type: ALERT.SET_ALERT,
        payload: { msg, alertType, id },
    });

    setTimeout(
        () => dispatch({ type: ALERT.REMOVE_ALERT, payload: id }),
        timeout
    );
};
