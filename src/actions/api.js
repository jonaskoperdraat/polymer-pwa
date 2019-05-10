export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

const URL_LOGIN = 'api/auth/login';
const URL_PROFILE = '/api/users/own';

export const logIn = (username, password) => async (dispatch) => {
  fetch(URL_LOGIN + '?username=' + username + '&password=' + password)
    .then(function (response) {
      if (response.status !== 200) {
        dispatch({
          type: LOG_IN_FAILURE,
          error: 'Error logging in. Status code: ' + response.status
        });
      } else {
        console.log('successfully logged in', response);
        response.json().then(function () {
          dispatch({
            type: LOG_IN_SUCCESS
          });
        });
        if (window.PasswordCredential) {
          // Call navigator.credentials.get() to retrieve stored
          // PasswordCredentials or FederatedCredentials.
          const credential = new PasswordCredential({
            name: 'polymer-pwa',
            id: username,
            password: password
          });
          navigator.credentials.store(credential).then(function (creds) {
          });
        }
      }
    }).catch(function (err) {
    dispatch({
      type: LOG_IN_FAILURE,
      error: 'Error logging in. Message: ' + err
    });
  });
};

function json(response) {
  return response.json();
}

export const retrieveUserDetails = () => async (dispatch) => {
  fetch(URL_PROFILE)
    .then(json)
    .then(function (data) {
      dispatch({
        type: UPDATE_USER_PROFILE,
        profile: data
      });
    })
    .catch(function (error) {
    });
};
