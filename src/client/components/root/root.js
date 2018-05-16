import React, { Component } from 'react';

export default class Root extends Component<> {
  static ssrApiActions = [];

  render() {
    return (
      <div className="root">
        Hello World!
      </div>
    );
  }
}
