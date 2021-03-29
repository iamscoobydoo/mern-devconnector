import * as ALERT from "../actions/types";

const initialState = [];

export default function alertReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ALERT.SET_ALERT:
            return [...state, payload];
        case ALERT.REMOVE_ALERT:
            return state.filter((alert) => alert.id !== payload);
        default:
            return state;
    }
}
