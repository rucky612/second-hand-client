import React, { Component } from 'react';
import withAuth from '../utils/withAuth';

class Root extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    return (
      <div>
        <h1>안녕!</h1>
      </div>
    );
  }
}

export default withAuth(Root);
