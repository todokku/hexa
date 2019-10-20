import React, { Component } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { Avatar } from 'react-native-elements';

import { FullLinearGradientButton } from 'hexaCustomeLinearGradientButton';
// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';
// TODO: Custome Object
const utils = require('hexaUtils');

interface Props {
  data: [];
  closeModal: Function;
  click_AcceptShare: Function;
}

export default class ModelSelfShareAcceptAndReject extends Component<
  Props,
  any
> {
  render() {
    const walletName =
      this.props.data.length != 0 ? this.props.data[0].walletName : 'temp';
    return (
      <Modal
        transparent
        animationType={'fade'}
        visible={
          this.props.data.length != 0 ? this.props.data[0].modalVisible : false
        }
        onRequestClose={() => this.props.closeModal()}
      >
        <View
          style={[
            styles.modalBackground,
            { backgroundColor: 'rgba(0,0,0,0.4)' },
          ]}
        >
          <View style={styles.viewModelBody}>
            <View style={{ flexDirection: 'row', flex: 0.5 }}>
              <Text
                style={[
                  FontFamily.ffFiraSansMedium,
                  {
                    fontSize: 20,
                    color: '#2F2F2F',
                    flex: 5,
                    textAlign: 'center',
                    marginTop: 10,
                  },
                ]}
              >
                Self Share
              </Text>
              <Button
                light
                iconLeft
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
                onPress={() => this.props.closeModal()}
              >
                <Icon name="close" style={{ alignSelf: 'center' }} />
              </Button>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Text
                note
                style={[
                  FontFamily.ffFiraSansMedium,
                  {
                    textAlign: 'center',
                    fontSize: 12,
                    marginBottom: 20,
                  },
                ]}
              >
                Please keep this share safe, the sender might need this share to
                restore wallet in case of device loss
              </Text>
              <Avatar medium rounded title={walletName.charAt(0)} />
              <Text style={FontFamily.ffFiraSansMedium} note>
                {walletName}
              </Text>
              <Text
                style={[
                  FontFamily.ffFiraSansRegular,
                  { textAlign: 'center', marginTop: 10 },
                ]}
              >
                This share will now be stored in More Address book. Tap on it to
                return share
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text
                note
                style={[
                  FontFamily.ffFiraSansMedium,
                  { textAlign: 'center', fontSize: 12 },
                ]}
              >
                You will need to open the Hexa application on your device once
                in two weeks to make sure the secret is still accessible
              </Text>
              <Button
                onPress={() => this.props.closeModal()}
                style={[
                  FontFamily.ffFiraSansSemiBold,
                  {
                    backgroundColor: '#838383',
                    borderRadius: 10,
                    margin: 5,
                    height: 50,
                  },
                ]}
                full
              >
                <Text>Reject Share</Text>
              </Button>
              <FullLinearGradientButton
                click_Done={() => this.props.click_AcceptShare(walletName)}
                title="Accept Share"
                disabled={false}
                style={[{ borderRadius: 10 }]}
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
    flex: utils.getIphoneSize() == 'iphone X' ? 0.8 : 0.7,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});