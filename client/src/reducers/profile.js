import * as ALERT from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {},
};

export default function profileReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ALERT.GET_PROFILE:
        case ALERT.UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
            };
        case ALERT.GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false,
            };
        case ALERT.GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false,
            };
        case ALERT.PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                profile: null,
            };
        case ALERT.CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: null,
                loading: false,
            };
        default:
            return state;
    }
}
