import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import ReduxThunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import NotificationsSystem from 'reapop';
import theme from 'components/UI/Notification/theme';
import createRootReducer from 'reducers';
import AppLoader from 'components/App/components/Loader/Loader';

/**
 * Define Redux middleware
 */

export const history = createBrowserHistory();
const middleware = [ReduxThunk, routerMiddleware(history)];

/**
 * Redux dev-tools
 */

const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

/**
 * Create new Redux store
 */

export const store = createStore(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<AppLoader />}>
          <ConnectedRouter history={history}>
            <>
              {this.props.children}
              <NotificationsSystem theme={theme} position="tc" />
            </>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
