import createAsyncAction from 'utilities/create-async-action';

/**
 * Create the action
 */

function retrieveAuthenticatedUser(fetch) {
  return fetch.get('api/auth/user');
}

const { thunk, request, success, error } = createAsyncAction({
  name: 'RETRIEVE_AUTHENTICATED_USER',
  asyncAction: retrieveAuthenticatedUser,
});

/**
 * Export the components
 */

export default thunk;
export { request, success, error };
