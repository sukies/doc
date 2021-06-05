import React, { Component } from 'react';
import { Provider } from './context';

export default class HashRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localtion: {
        pathname: window.location.hash.slice(1) || '/',
      },
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
        console.log(this.state)
      this.setState({
        localtion: {
          ...this.state.localtion,
          pathname: window.location.hash.slice(1),
        },
      });
    });
  }

  render() {
    const { path, component: Components } = this.props;
    return <Provider value={this.state.localtion}>{this.props.children}</Provider>;
  }
}
