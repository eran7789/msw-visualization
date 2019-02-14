import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';

import Home from 'components/pages/home';

class Root extends Component<> {
  static ssrApiActions = [];

  render() {
    const { route, } = this.props;
    const childRoutes = renderRoutes(route.routes);

    return (
      <div className="root">
        {childRoutes}
      </div>
    );
  }
}

export default Root;
