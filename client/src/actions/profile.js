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
        dispatch({ type: ALERT.CLEAR_PROFILE });
        dispatch({
            type: ALERT.PROFILE_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//get all profiles
export const getAllProfiles = () => async (dispatch) => {
    dispatch({ type: ALERT.CLEAR_PROFILE });

    try {
        const res = await axios.get("/api/profile");
        dispatch({
            type: ALERT.GET_PROFILES,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ALERT.PROFILE_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//get a profile by its ID
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
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

//get github repos
export const getGithubRepos = (githubusername) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/github/${githubusername}`);
        dispatch({
            type: ALERT.GET_REPOS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ALERT.NO_REPOS,
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

//add experience
export const addExperience = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.put("/api/profile/experience", formData, config);
        dispatch({
            type: ALERT.UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Experience Added", "success"));

        history.push("/dashboard");
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

//add education
export const addEducation = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.put("/api/profile/education", formData, config);
        dispatch({
            type: ALERT.UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Education Added", "success"));

        history.push("/dashboard");
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

//delete experience
export const deleteExperience = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: ALERT.UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Experience Removed", "success"));
    } catch (err) {
        dispatch({
            type: ALERT.PROFILE_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//delete education
export const deleteEducation = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: ALERT.UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Education Removed", "success"));
    } catch (err) {
        dispatch({
            type: ALERT.PROFILE_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//delete account and profile
export const deleteAccount = () => async (dispatch) => {
    if (window.confirm("Are you sure? This can NOT be undone!")) {
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await axios.delete("api/profile");

            dispatch({ type: ALERT.CLEAR_PROFILE });
            dispatch({ type: ALERT.ACCOUNT_DELETED });

            dispatch(setAlert("Your Account has been permanently deleted"));
        } catch (err) {
            dispatch({
                type: ALERT.PROFILE_ERROR,
                payload: { status: err.response.status, msg: err.response.statusText },
            });
        }
    }
};
