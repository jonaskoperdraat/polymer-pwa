import {
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    LOG_OUT
} from '../actions/api.js';
import {UPDATE_USER_PROFILE} from "../actions/api";

const INITIAL_STATE = {
    loggedIn: false,
    logInError : ''
};

const api = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOG_IN_SUCCESS:
        case LOG_IN_FAILURE:
        case LOG_OUT:
            return {
                ...state,
                loggedIn: action.type === LOG_IN_SUCCESS,
                jwt: action.type === LOG_IN_SUCCESS ? action.jwt : '',
                logInError: action.type === LOG_IN_FAILURE ? action.error : ''
            };
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                profile: action.profile
            };
        default:
            return state;
    }
};

export default api;
