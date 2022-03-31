/**
 * Import depedencies
 */

import { combineReducers } from 'redux';
import localForage from 'localforage';
import { persistReducer } from 'redux-persist';

/**
 * Import reducers
 */

import { connectRouter } from 'connected-react-router';
import { reducer as notificationsReducer } from 'reapop';

import authenticationReducer from './authentication';

/**
 * List all reducers
 */

const authenticationPersistConfig = {
  key: 'authentication',
  storage: localForage,
  whitelist: ['user', 'token'],
};

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    notifications: notificationsReducer(),
    authentication: persistReducer(
      authenticationPersistConfig,
      authenticationReducer
    ),
  });
