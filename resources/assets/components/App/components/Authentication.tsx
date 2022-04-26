// Components==============
import retrieveAuthenticatedUser from 'actions/authentication/retrieve';
import Loader from 'components/App/components/Loader/Loader';
import { useRedux } from 'hooks/useRedux';
import { useReduxAction } from 'hooks/useReduxAction';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';

function Authentication({ children }: { children: React.ReactNode }) {
  const dispatch = useReduxAction();

  const isInitialised = useRedux(
    (state) => state?.authentication?.isInitialised
  );

  useEffect(() => {
    dispatch(retrieveAuthenticatedUser());
  }, []);

  if (!isInitialised) {
    return <Loader />;
  }

  return children;
}

// @ts-ignore
export default withRouter(Authentication);
