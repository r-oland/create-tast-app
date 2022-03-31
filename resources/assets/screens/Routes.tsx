import { UnauthenticatedRoute } from 'components/Route';
import React from 'react';
import { Switch } from 'react-router';
import Home from './Home/Home';

export default function Routes() {
  return (
    <Switch>
      <UnauthenticatedRoute path="/" component={Home} />
    </Switch>
  );
}
