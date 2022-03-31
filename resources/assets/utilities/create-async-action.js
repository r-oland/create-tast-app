import { createAction } from 'redux-act';
import fetch from './fetch';

/**
 * Create an async action and corresponding status actions
 *
 * @param {String} name
 * @param {Function} asyncAction
 * @param {Object} config
 */
function createAsyncAction({
  name,
  asyncAction,
  messages,
  onError,
  onSuccess,
}) {
  const upperName = name.toUpperCase();

  // Create all actions
  const request = createAction(`${upperName}__REQUEST`);
  const success = createAction(`${upperName}_SUCCESS`);
  const error = createAction(`${upperName}_ERROR`);

  // Create the thunked action
  const thunk = function (...args) {
    return async function (dispatch, getState) {
      // Retrieve the fetch function
      const fetchWrapper = await fetch(dispatch, getState);

      // Dispatch the request action
      dispatch(request());

      // Execute the asyncAction provided
      return asyncAction(...args, fetchWrapper, dispatch, getState)
        .then((response) => {
          // Dispatch the success action
          dispatch(success(response.data));

          // Allow hook for accessing a successful dispatch
          if (onSuccess) {
            onSuccess(response.data, dispatch, getState, args);
          }

          // Return the data
          return response.data;
        })
        .catch((asyncError) => {
          // Dispatch the error
          dispatch(
            error({
              error: asyncError,
              response: asyncError.response,
              message: messages ? messages.error : undefined,
            })
          );

          // Allow hook for accessing the error handler
          if (onError) {
            onError(asyncError, dispatch, getState);
          }

          // Propagate the error so that components that depend on this promise
          // do not mistakenly assume that everything went right
          throw asyncError;
        });
    };
  };

  // Return the actions and the thunk
  return {
    request,
    success,
    error,
    thunk,
  };
}

export default createAsyncAction;
