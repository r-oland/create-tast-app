import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

/**
 * Import components
 */

import Loader from 'components/App/components/Loader/Loader';

/**
 * Inject actions into the components
 */

import retrieveAuthenticatedUser from 'actions/authentication/retrieve';

/**
 * Retrieve a part of the store
 */

const mapStateToProps = (state) => ({
  isInitialised: state.authentication.isInitialised,
});

const mapDispatchToProps = {
  retrieveAuthenticatedUser,
};

class Authentication extends Component {
  componentDidMount() {
    this.props.retrieveAuthenticatedUser();
  }

  render() {
    if (!this.props.isInitialised) {
      return <Loader />;
    }

    return this.props.children;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Authentication)
);
