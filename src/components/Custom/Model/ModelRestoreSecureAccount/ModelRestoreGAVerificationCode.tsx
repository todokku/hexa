import React, { Component } from 'react';
import { Modal, View, StyleSheet, Platform } from 'react-native';
import { Button, Text } from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';

// TODO: Custome Compontes
import { FullLinearGradientButton } from 'hexaCustomeLinearGradientButton';
import { SvgIcon } from '@up-shared/components';

// TODO: Custome Pages
import { ModelLoader } from 'hexaLoader';

// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';
// TODO: Custome Object
import { colors, localDB } from 'hexaConstants';

const dbOpration = require('hexaDBOpration');
const utils = require('hexaUtils');

interface Props {
  data: [];
  pop: Function;
  closeModal: Function;
  click_Next: Function;
}

// Bitcoin Files
const comFunDBRead = require('hexaCommonDBReadData');

export default class ModelRestoreGAVerificationCode extends Component<
  Props,
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {
      otp: '',
      xPub: '',
      prevScreenName: '',
      prevData: [],
      passcodeStyle: [
        {
          activeColor: colors.black,
          inactiveColor: colors.black,
          cellBorderWidth: 0,
        },
      ],
      flag_NextBtnDisable: true,
      flag_Loading: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const { data } = nextProps;
    // console.log( { data } );
    if (data.length != 0) {
      if (data[0].modalVisible == true) {
        this.setState({
          xPub: data[0].xPub,
          prevScreenName: data[0].prevScreenName,
          prevData: data[0].prevData,
        });
      }
    }
  }

  // TODO: Otp enter after
  _onFinishCheckingCode(code: any) {
    // console.log( { code } );
    if (code.length == 6) {
      this.setState({
        otp: code,
        flag_NextBtnDisable: false,
      });
    }
  }

  // TODO: Click on next button
  click_Next = async () => {
    this.setState({
      flag_Loading: true,
    });
    const dateTime = Date.now();
    const code = this.state.otp;
    const { xPub } = this.state;
    const { prevScreenName } = this.state;
    const { prevData } = this.state;
    const resultWallet = await utils.getWalletDetails();
    const secureAccount = await utils.getSecureAccountObject();
    // const secureAccount = new SecureAccount( resultWallet.mnemonic );
    const resImportSecureAccount = await secureAccount.importSecureAccount(
      code,
      xPub,
    );
    if (resImportSecureAccount.imported == true) {
      const address = await secureAccount.getAddress();
      // console.log( { address } );
      const balance = await secureAccount.getBalance();
      // console.log( { balance } );
      // reading wallet details
      await comFunDBRead.readTblWallet();
      // Secure account insert
      let resUpdateSSSRetoreDecryptedShare;
      if (prevScreenName != 'Wallet') {
        resUpdateSSSRetoreDecryptedShare = await dbOpration.updateSecureAccountAddressAndBal(
          localDB.tableName.tblAccount,
          address,
          balance.data.balance,
          2,
        );
      } else {
        // console.log( { prevData } );
        resUpdateSSSRetoreDecryptedShare = await dbOpration.updateSecureAccountAddressAndBal(
          localDB.tableName.tblAccount,
          address,
          balance.data.balance,
          prevData.id,
        );
      }
      if (resUpdateSSSRetoreDecryptedShare) {
        this.setState({
          flag_Loading: false,
        });
        setTimeout(() => {
          this.props.click_Next();
        }, 100);
      }
    }
  };

  render() {
    const { flag_NextBtnDisable } = this.state;
    const { flag_Loading } = this.state;
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
            { backgroundColor: `rgba(0,0,0,0.4)` },
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
                    marginLeft: 10,
                    marginRight: 10,
                  },
                ]}
              >
                Enter the GA verification code
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Text style={{ textAlign: 'center', margin: 20 }}>Step 2</Text>
              <Text note style={{ textAlign: 'center', margin: 20 }}>
                Enter the next in sequence verification code generated on Google
                Authentication for your Hexa Wallet
              </Text>
              <CodeInput
                ref="codeInputRef1"
                secureTextEntry
                keyboardType="default"
                autoCapitalize="sentences"
                codeLength={6}
                activeColor={this.state.passcodeStyle[0].activeColor}
                inactiveColor={this.state.passcodeStyle[0].inactiveColor}
                className="border-box"
                cellBorderWidth={this.state.passcodeStyle[0].cellBorderWidth}
                autoFocus={false}
                inputPosition="center"
                space={5}
                size={47}
                codeInputStyle={{
                  borderRadius: 5,
                  backgroundColor: '#F1F1F1',
                }}
                containerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: Platform.OS == 'ios' ? 0 : 40,
                }}
                onFulfill={(code: any) => this._onFinishCheckingCode(code)}
                type="withoutcharacters"
              />
            </View>
            <View style={{ flex: 0.7, justifyContent: 'flex-end' }}>
              <Text note style={{ textAlign: 'center', margin: 20 }}>
                In case you do not have the code, refer to the PDF downloaded
                while backing up secure account
              </Text>
              <FullLinearGradientButton
                click_Done={() => this.click_Next()}
                title="Next"
                disabled={flag_NextBtnDisable}
                style={[
                  flag_NextBtnDisable == true
                    ? { opacity: 0.4 }
                    : { opacity: 1 },
                  { borderRadius: 10 },
                ]}
              />
            </View>
            <ModelLoader
              loading={flag_Loading}
              color={colors.appColor}
              size={30}
            />
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
    flex: utils.getIphoneSize() == 'iphone X' ? 0.6 : 0.8,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});