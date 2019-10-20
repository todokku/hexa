import React, { Component } from 'react';
import { StatusBar } from 'react-native';

export default class CustomStatusBar extends Component<any, any> {
  render() {
    return (
      <StatusBar
        barStyle={this.props.barStyle}
        backgroundColor={this.props.backgroundColor}
        translucent={true}
        hidden={this.props.hidden}
      />
    );
  }
}