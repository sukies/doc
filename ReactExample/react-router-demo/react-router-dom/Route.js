import React, { Component } from 'react';
import { Consumer } from './context';
import { pathToRegexp } from 'path-to-regexp';

export default class Router extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { path, component: Components } = this.props;
    return (
      <Consumer>
        {({ pathname }) => {
          const reg = pathToRegexp(path, [], { end: false })
          if (pathname.match(reg)) {
            return <Components />;
          }
          return null;
        }}
      </Consumer>
    );
  }
}
