import React, { Component } from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'native-base';

// TODO: Custome Compontes
import { FullLinearGradientButton } from 'hexaCustomeLinearGradientButton';

import { SvgIcon } from '@up-shared/components';
// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';
// TODO: Custome Object
import { images } from 'hexaConstants';

// TODO: Common Funciton
const utils = require('hexaUtils');

interface Props {
  data: [];
  pop: Function;
  closeModal: Function;
  click_Next: Function;
}

export default class ModelBackupSecureAccount extends Component<Props, any> {
  pdfObj = null;

  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      pdfDetails: [],
      pdfFilePath: '',
      flag_NextBtnDisable: false,
      flag_Loading: true,
      flag_XPubQR: false,
      flg: false,
    };
  }

  header(text: any) {
    this.setState({
      flg: true,
    });
    return { text, margins: [0, 0, 0, 8] };
  }

  UNSAFE_componentWillReceiveProps = async (nextProps: any) => {
    // this point use backgound task
    setTimeout(() => {
      const { data } = nextProps;
      // console.log( { data } );
      if (data[0].modalVisible == true) {
        this.setState({
          data: data[0].secureAccountDetails,
        });
      }
    }, 100);
  };

  render() {
    const data = this.props.data.length != 0 ? this.props.data : [];
    return (
      <Modal
        transparent
        animationType={'fade'}
        visible={data.length != 0 ? data[0].modalVisible : false}
        onRequestClose={() => this.props.closeModal()}
      >
        <View
          style={[
            styles.modalBackground,
            { backgroundColor: 'rgba(0,0,0,0.4)' },
          ]}
        >
          <View style={styles.viewModelBody}>
            <View style={{ flexDirection: 'row', flex: 0.2 }}>
              <Button
                transparent
                hitSlop={{
                  top: 5,
                  bottom: 8,
                  left: 10,
                  right: 15,
                }}
                onPress={() => this.props.pop()}
              >
                <SvgIcon name="icon_back" size={25} color="gray" />
              </Button>
              <Text
                style={[
                  FontFamily.ffFiraSansMedium,
                  {
                    fontSize: 20,
                    color: '#2F2F2F',
                    flex: 6,
                    textAlign: 'center',
                    marginTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                  },
                ]}
              >
                Backup Secure Wallet
              </Text>
            </View>
            <View
              style={{
                flex: utils.getIphoneSize() == 'iphone X' ? 1.4 : 1.2,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Text note style={{ textAlign: 'center', margin: 20 }}>
                To backup your secure account you will have to follow these
                steps.
              </Text>
              <Image
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
                source={images.backupSecureAccount.steps}
              />
            </View>
            <View style={{ flex: 0.4, justifyContent: 'flex-end' }}>
              <FullLinearGradientButton
                click_Done={() => this.props.click_Next(this.state.data)}
                title="Next"
                disabled={false}
                style={[{ opacity: 1 }, { borderRadius: 10 }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  viewModelBody: {
    flex: utils.getIphoneSize() == 'iphone X' ? 0.9 : 0.9,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});