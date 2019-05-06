export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

import { store } from '../store.js';

const URL_LOGIN = 'api/auth/login';
const URL_PROFILE = '/api/users/own';

export const logIn = (username, password) => async (dispatch, getState) => {
    console.log('logging in to API', dispatch, getState());
    fetch(URL_LOGIN + '?username=' + username + '&password=' + password)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Error logging in. Status code: ' + response.status);
                dispatch({
                    type: LOG_IN_FAILURE,
                    error: 'Error logging in. Status code: ' + response.status
                });
            } else {
                console.log('Succesfully logged in', response);
                response.json().then(function(data) {
                    console.log('body', data);
                    dispatch({
                        type: LOG_IN_SUCCESS,
                        jwt: data.jwt
                    });
                });
                if (window.PasswordCredential) {
                    console.log('Attempting to store credentials.');
                    // Call navigator.credentials.get() to retrieve stored
                    // PasswordCredentials or FederatedCredentials.
                    const credential = new PasswordCredential({
                        name: 'polymer-pwa',
                        id: username,
                        password: password
                    });
                    navigator.credentials.store(credential).then(function(creds) {
                        console.log('Stored credentials', creds);
                    });
                }
            }
        }).catch(function (err) {
        console.log('Fetch error', err);
        dispatch({
            type: LOG_IN_FAILURE,
            error: 'Error logging in. Message: ' + err
        });
    });
};

function json(response) {
    return response.json();
}

export const retrieveUserDetails = () => async (dispatch, getSTate) => {
    console.log('retrieve user details.');
    const state = store.getState();
    console.log('jwt', state.api.jwt);

    const token = state.api.jwt;

    fetch(URL_PROFILE, {
        headers: {
            Authorization: 'bearer ' + token
        }
    }).then(json)
    .then(function (data) {
        dispatch({
            type: UPDATE_USER_PROFILE,
            profile: data
        });
    })
    .catch(function (error) {
        console.log('error', error);
    });
};
