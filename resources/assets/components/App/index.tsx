import React from 'react';
// eslint-disable-next-line import/order
import Routes from 'screens/Routes';
import AuthenticatedApp from './components/AuthenticatedApp';

export default function App() {
  return (
    <AuthenticatedApp>
      <Routes />
    </AuthenticatedApp>
  );
}
