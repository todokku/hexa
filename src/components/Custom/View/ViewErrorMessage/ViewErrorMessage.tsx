import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import IconFontAwe from 'react-native-vector-icons/FontAwesome';

import { renderIf } from 'hexaValidation';

export default class ViewErrorMessage extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      type: '',
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    const { data } = nextProps;
    // console.log( { data } );
    if (data != undefined) {
      this.setState({
        data: data[0].data[0],
        type: data[0].type,
      });
    }
  };

  render = () => {
    // array
    const { data, type } = this.state;
    return (
      <View
        style={[
          Platform.OS == 'android'
            ? { marginTop: StatusBar.currentHeight }
            : null,
        ]}
      >
        {renderIf(type == 'offline')(
          <View
            style={{
              backgroundColor: data.bgColor,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                flex: 1,
                color: data.color,
              }}
            >
              {data.message}
            </Text>
            <IconFontAwe
              name="refresh"
              size={20}
              color={data.color}
              style={{ flex: 0.1 }}
            />
          </View>,
        )}
        {renderIf(type == 'asyncTask')(
          <View
            style={{
              backgroundColor: data.bgColor,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                flex: 1,
                color: data.color,
              }}
            >
              {data.message}
            </Text>
            <ActivityIndicator size="small" color={data.color} />
          </View>,
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({});