import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Platform,
  Image,
  SafeAreaView,
  ImageBackground,
  Alert,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import CodeInput from 'react-native-confirmation-code-input';
import * as Keychain from 'react-native-keychain';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// TODO: Custome Pages
import { ModelLoader } from 'hexaLoader';
import { CustomStatusBar } from 'hexaCustStatusBar';
import { FullLinearGradientButton } from 'hexaCustomeLinearGradientButton';

// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';

// TODO: Custome Object
import { colors, images, asyncStorageKeys } from 'hexaConstants';
import { renderIf } from 'hexaValidation';
import Singleton from 'hexaSingleton';

export default class PasscodeConfirm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      mnemonicValues: '',
      status: false,
      pincode: '',
      success: 'Passcode does not match!',
      passcodeSecoundStyle: [
        {
          activeColor: colors.black,
          inactiveColor: colors.black,
          cellBorderWidth: 0,
        },
      ],
      isLoading: false,
    };
  }

  // async componentDidMount() {
  //   // let mnemonic = await utils.getMnemonic();
  //   // alert( { mnemonic } );
  //   this.setState( {
  //     mnemonicValues: utils.getMnemonic()
  //   } );
  // }

  onCheckPincode(code: any) {
    try {
      this.setState({
        pincode: code,
      });
    } catch (error) {
      Alert.alert(error);
    }
  }

  _onFinishCheckingCode2(isValid: boolean, code: any) {
    try {
      if (isValid) {
        this.setState({
          pincode: code,
          status: true,
          passcodeSecoundStyle: [
            {
              activeColor: colors.black,
              inactiveColor: colors.black,
              cellBorderWidth: 0,
            },
          ],
        });
      } else {
        this.setState({
          passcodeSecoundStyle: [
            {
              activeColor: 'red',
              inactiveColor: 'red',
              cellBorderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      Alert.alert(error);
    }
  }

  saveData = async () => {
    try {
      const code = this.state.pincode;
      const commonData = Singleton.getInstance();
      commonData.setPasscode(code);
      const username = 'HexaWallet';
      const password = code;
      // Store the credentials
      await Keychain.setGenericPassword(username, password);
      AsyncStorage.setItem(
        asyncStorageKeys.flag_PasscodeCreate,
        JSON.stringify(true),
      );
      const resetAction = StackActions.reset({
        index: 0, // <-- currect active route from actions array
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: 'RestoreAndWalletSetupNavigator',
          }),
        ],
      });
      AsyncStorage.setItem(
        asyncStorageKeys.rootViewController,
        'RestoreAndWalletSetupNavigator',
      );
      this.props.navigation.dispatch(resetAction);
    } catch (e) {
      Alert.alert(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={images.WalletSetupScreen.WalletScreen.backgoundImage}
          style={styles.container}
        >
          <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
          >
            <KeyboardAwareScrollView
              enableOnAndroid
              extraScrollHeight={40}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={styles.viewAppLogo}>
                <Image style={styles.imgAppLogo} source={images.appIcon} />
                <Text
                  style={[
                    FontFamily.ffFiraSansBold,
                    { color: '#000000', marginTop: 20 },
                  ]}
                >
                  Welcome to Hexa!
                </Text>
              </View>
              <View style={styles.viewFirstPasscode}>
                <Text
                  style={[
                    FontFamily.ffFiraSansMedium,
                    { marginTop: 10, color: '#8B8B8B' },
                  ]}
                  note
                >
                  Create Pin
                </Text>
                <CodeInput
                  ref="codeInputRef"
                  secureTextEntry
                  keyboardType="numeric"
                  codeLength={5}
                  activeColor={colors.black}
                  inactiveColor={colors.black}
                  className="border-box"
                  cellBorderWidth={0}
                  autoFocus={true}
                  inputPosition="center"
                  space={10}
                  size={55}
                  containerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: Platform.OS == 'ios' ? 0 : 40,
                  }}
                  codeInputStyle={{
                    borderRadius: 5,
                    backgroundColor: '#F1F1F1',
                  }}
                  onFulfill={code => this.onCheckPincode(code)}
                  type="withoutcharacters"
                />
              </View>
              <View style={styles.viewSecoundPasscode}>
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    color: '#8B8B8B',
                  }}
                >
                  Re - Enter Pin{' '}
                </Text>
                <CodeInput
                  ref="codeInputRef1"
                  secureTextEntry
                  keyboardType="numeric"
                  codeLength={5}
                  activeColor={this.state.passcodeSecoundStyle[0].activeColor}
                  inactiveColor={
                    this.state.passcodeSecoundStyle[0].inactiveColor
                  }
                  className="border-box"
                  cellBorderWidth={
                    this.state.passcodeSecoundStyle[0].cellBorderWidth
                  }
                  compareWithCode={this.state.pincode}
                  autoFocus={false}
                  inputPosition="center"
                  space={10}
                  size={55}
                  codeInputStyle={{
                    borderRadius: 5,
                    backgroundColor: '#F1F1F1',
                  }}
                  containerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: Platform.OS == 'ios' ? 0 : 40,
                  }}
                  onFulfill={(isValid, code) =>
                    this._onFinishCheckingCode2(isValid, code)
                  }
                  type="withoutcharacters"
                />
                {renderIf(
                  this.state.passcodeSecoundStyle[0].activeColor == 'red',
                )(
                  <Text
                    style={[
                      FontFamily.ffFiraSansBookItalic,
                      { color: 'red', marginTop: 44 },
                    ]}
                  >
                    {this.state.success}
                  </Text>,
                )}
              </View>
              <View style={styles.viewBtnProceed}>
                <FullLinearGradientButton
                  style={[
                    this.state.status == true
                      ? { opacity: 1 }
                      : { opacity: 0.4 },
                    { borderRadius: 5 },
                  ]}
                  disabled={this.state.status != true}
                  title="PROCEED"
                  click_Done={() => this.saveData()}
                />
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </ImageBackground>
        <ModelLoader
          loading={this.state.isLoading}
          color={colors.appColor}
          size={30}
        />
        <CustomStatusBar
          backgroundColor={colors.white}
          hidden={false}
          barStyle="dark-content"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewAppLogo: {
    flex: 0.5,
    alignItems: 'center',
    marginTop: 50,
  },
  viewFirstPasscode: {
    flex: 1.4,
    alignItems: 'center',
  },
  viewSecoundPasscode: {
    flex: 1.4,
    alignItems: 'center',
  },
  viewBtnProceed: {
    flex: 0.2,
    marginTop: 20,
  },
  imgAppLogo: {
    height: 150,
    width: 150,
  },
});