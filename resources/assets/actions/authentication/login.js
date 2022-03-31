import { createAction } from 'redux-act';
import fetch from 'axios';

/**
 * Create the action
 */

import { push } from 'connected-react-router';
import retrieveUser from './retrieve';

const request = createAction('LOGIN_REQUEST');
const success = createAction('LOGIN_SUCCESS');
const error = createAction('ERROR');

function loginUser(data, token = false) {
  return function (dispatch) {
    // Dispatch the request action
    dispatch(request);

    // Either exchange a password or a token for
    // an access_token
    const endpoint = token ? 'token' : 'login';

    return fetch
      .post(`/api/auth/${endpoint}`, data)
      .then(({ result }) => {
        // Dispatch successa action
        dispatch(success(result));

        // Redirect user to front page
        return dispatch(retrieveUser());
      })
      .then(() => dispatch(push('/auth/landing')))
      .catch((err) => {
        dispatch(error(err));
        throw err;
      });
  };
}

/**
 * Export the components
 */

export { loginUser as default };
export { request, success, error };
