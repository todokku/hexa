/* eslint-disable react-native/no-raw-text */
/* eslint-disable react/jsx-key */
import React from 'react';
import { StyleSheet, View, Platform, Dimensions, Alert } from 'react-native';
import {
  Header,
  Title,
  Item,
  Input,
  Button,
  Left,
  Right,
  Body,
  Text,
  Picker,
  Icon,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import bip39 from 'react-native-bip39';

// TODO: Redux
import { connect } from 'react-redux';
import { setupAccounts } from 'HexaWallet/src/redux';

// TODO: Custome Pages
import { ModelLoader } from 'hexaLoader';
import { FullLinearGradientButton } from 'hexaCustomeLinearGradientButton';

// TODO: Custome Alert
import { AlertSimple } from 'hexaCustAlert';

// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';

// TODO: Custome Object
import { colors, localDB } from 'hexaConstants';

// TODO: Custome Validation
import { validationService } from 'hexaValidation';

import { S3Service, RegularAccount, SecureAccount } from 'hexaBitcoin';

const alert = new AlertSimple();
const utils = require('hexaUtils');
const dbOpration = require('hexaDBOpration');

// TODO: Common Funciton
const comAppHealth = require('hexaCommonAppHealth');
const comFunDBRead = require('hexaCommonDBReadData');

// TODO: Bitcoin Files
const bitcoinClassState = require('hexaClassState');
// import S3Service from "HexaWallet/src/bitcoin/services/sss/S3Service";
// import RegularAccount from "HexaWallet/src/bitcoin/services/accounts/RegularAccount";
// import SecureAccount from "HexaWallet/src/bitcoin/services/accounts/SecureAccount";

class FirstSecretQuestion extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputs: {
        answer: {
          type: 'answer',
          value: '',
        },
        confirmAnswer: {
          type: 'confirmAnswer',
          value: '',
        },
      },
      arr_QuestionList: [
        {
          item: 'To what city did you go the first time you flew on a plane?',
        },
        {
          item: 'What is the first name of the person you first kissed?',
        },
        {
          item: 'What is the first name of your best friend in high school?',
        },
        {
          item: 'What is the first name of your oldest nephew?',
        },
        {
          item: 'What is the first name of your oldest niece?',
        },
        {
          item: 'What was the first name of your favourite childhood friend?',
        },
        {
          item: 'What was the last name of your third grade teacher?',
        },
        {
          item:
            'What was the street name where your best friend in high school lived (street name only)?',
        },
        {
          item: 'In what city or town was your first job?',
        },
        {
          item: 'What was the last name of your favorite childhood teacher?',
        },
        {
          item:
            'What was the name of the company where you had your first job?',
        },
        {
          item:
            'What was the name of the street where you were living when you were 10 years old?',
        },
      ],
      firstQuestion:
        'To what city did you go the first time you flew on a plane?',
      firstAnswer: '',
      secoundAnswer: '',
      flag_ConfirmDisableBtn: true,
    };
    this.onInputChange = validationService.onInputChange.bind(this);
    this.getFormValidation = validationService.getFormValidation.bind(this);
  }

  componentDidMount = () => {
    this.props.setupAccounts();
  };

  // TODO: Select Picker Question List change aciton
  onValueChange = (value: string) => {
    try {
      console.log({ value });
      this.setState({
        firstQuestion: value,
      });
    } catch (error) {
      Alert.alert(error);
    }
  };

  // TODO: func check_CorrectAnswer
  check_CorrectAnswer = () => {
    try {
      const firstAns = this.state.firstAnswer;
      const secoundAns = this.state.secoundAnswer;
      console.log({ firstAns, secoundAns });
      if (firstAns == secoundAns && firstAns.length >= 3) {
        this.setState({
          flag_ConfirmDisableBtn: false,
        });
      } else {
        this.setState({
          flag_ConfirmDisableBtn: true,
        });
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  // TODO: func click_FirstQuestion
  click_FirstQuestion = async () => {
    const {
      mnemonic,
      regularAccount,
      secureAccount,
      sss,
    } = this.props.setUpAccounts;
    console.log({ mnemonic, regularAccount, secureAccount, sss });
    if (mnemonic) {
      try {
        this.getFormValidation();
        this.setState({
          flag_Loading: true,
        });
        const question = this.state.firstQuestion;
        const answer = this.state.secoundAnswer;
        const resWalletData = await utils.getSetupWallet();
        const dateTime = Date.now();
        const { walletName } = resWalletData;

        // setup Check Health
        const updateShareIdStatus = await comAppHealth.checkHealthSetupShare(
          dateTime,
        );
        if (updateShareIdStatus != '') {
          console.log({ updateShareIdStatus });
          const arrQustionList = [];
          const questionData = {};
          questionData.Question = question;
          questionData.Answer = answer;
          arrQustionList.push(questionData);
          const arrBackupInfo = [
            { backupType: 'new' },
            { backupMethod: 'share' },
          ];
          const resInsertWallet = await dbOpration.insertWallet(
            localDB.tableName.tblWallet,
            dateTime,
            mnemonic,
            '',
            '',
            '',
            walletName,
            arrBackupInfo,
            arrQustionList,
            updateShareIdStatus,
          );
          await comFunDBRead.readTblWallet();
          const resInsertCreateAcc = await dbOpration.insertCreateAccount(
            localDB.tableName.tblAccount,
            dateTime,
            '',
            '0',
            'BTC',
            'Regular Account',
            'Regular Account',
            '',
          );
          const resInsertSecureCreateAcc = await dbOpration.insertCreateAccount(
            localDB.tableName.tblAccount,
            dateTime,
            '',
            '0',
            'BTC',
            'Secure Account',
            'Secure Account',
            '',
          );
          const resDeleteTableData = await dbOpration.deleteTableData(
            localDB.tableName.tblSSSDetails,
          );
          if (
            resInsertWallet &&
            resInsertSecureCreateAcc &&
            resInsertCreateAcc &&
            resDeleteTableData
          ) {
            await bitcoinClassState.setRegularClassState(regularAccount);
            // secure account
            await bitcoinClassState.setSecureClassState(secureAccount);
            await bitcoinClassState.setS3ServiceClassState(sss);
            // s3serverice
            await comFunDBRead.readTblSSSDetails();
            await comFunDBRead.readTblWallet();
            this.setState({
              flag_Loading: false,
            });
            this.props.click_Next();
          }
        } else {
          alert.simpleOk('Oops', 'Check Health Issue.');
        }
      } catch (error) {
        Alert.alert(error);
      }
    }
  };

  // restrict = ( event: any ) => {
  //     // console.log( { event, char: event.keyCode } );
  //     // const regex = new RegExp( "/^[^!-\\/:-@\\[-`{-~]+$/;" );
  //     // const key = String.fromCharCode( !event.keyCode ? event.which : event.charCode );
  //     // console.log( { key } );
  //     // if ( !regex.test( key ) ) {
  //     //     event.preventDefault();
  //     return false;
  //     // }
  // }

  renderError(id: any) {
    const { inputs } = this.state;
    if (inputs[id].errorLabel) {
      return (
        <Text style={[validationService.styles.error, { marginBottom: 5 }]}>
          {inputs[id].errorLabel}
        </Text>
      );
    }
    return null;
  }

  render() {
    // flag
    const { flag_Loading } = this.state;
    const itemList = this.state.arr_QuestionList.map(
      (item: any, index: number) => (
        <Picker.Item label={item.item} value={item.item} />
      ),
    );
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={40}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.viewPagination}>
            <Text
              style={[
                FontFamily.ffFiraSansMedium,
                {
                  fontWeight: 'bold',
                  fontSize: 22,
                  textAlign: 'center',
                },
              ]}
            >
              Step 2: Select security question
            </Text>
            <Text
              style={[
                FontFamily.ffFiraSansMedium,
                { marginTop: 20, textAlign: 'center' },
              ]}
            >
              Select the question and specify the answer at least three
              characters long such that you always remember it and no one can
              easily guess it
            </Text>
          </View>
          <View style={styles.viewInputFiled}>
            <View style={[styles.itemQuestionPicker]}>
              <Picker
                renderHeader={backAction => (
                  <Header style={{ backgroundColor: '#ffffff' }}>
                    <Left>
                      <Button transparent onPress={backAction}>
                        <Icon name="arrow-back" style={{ color: '#000' }} />
                      </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                      <Title
                        style={[FontFamily.ffFiraSansMedium, { color: '#000' }]}
                      >
                        Select Question
                      </Title>
                    </Body>
                    <Right />
                  </Header>
                )}
                mode="dropdown"
                style={[FontFamily.ffFiraSansMedium]}
                iosIcon={
                  <Icon
                    name="arrow-down"
                    style={{
                      fontSize: 25,
                      marginLeft: -20,
                    }}
                  />
                }
                selectedValue={this.state.firstQuestion}
                onValueChange={this.onValueChange.bind(this)}
              >
                {itemList}
              </Picker>
            </View>
            <View>
              <Item rounded style={styles.itemInputWalletName}>
                <Input
                  secureTextEntry
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={Platform.OS == 'ios'}
                  placeholder="Write your answer here"
                  style={[FontFamily.ffFiraSansMedium]}
                  placeholderTextColor="#B7B7B7"
                  onChangeText={value => {
                    this.setState(
                      {
                        firstAnswer: value,
                      },
                      () => this.check_CorrectAnswer(),
                    );
                    this.onInputChange({
                      id: 'answer',
                      value,
                    });
                  }}
                />
              </Item>
              {this.renderError('answer')}
            </View>
            <View>
              <Item rounded style={styles.itemInputWalletName}>
                <Input
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Confirm answer"
                  style={[FontFamily.ffFiraSansMedium]}
                  placeholderTextColor="#B7B7B7"
                  onChangeText={value => {
                    this.setState(
                      {
                        secoundAnswer: value,
                      },
                      () => this.check_CorrectAnswer(),
                    );
                    this.onInputChange({
                      id: 'confirmAnswer',
                      value,
                    });
                  }}
                />
              </Item>
              {this.renderError('confirmAnswer')}
            </View>
          </View>
          <View style={styles.viewProcedBtn}>
            <Text
              note
              style={[
                FontFamily.ffFiraSansMedium,
                {
                  textAlign: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 20,
                },
              ]}
              numberOfLines={2}
            >
              The answer is never stored anywhere and even your contacts do not
              know this answer{' '}
            </Text>
            <FullLinearGradientButton
              title="Go To Wallet"
              disabled={this.state.flag_ConfirmDisableBtn}
              style={[
                this.state.flag_ConfirmDisableBtn == true
                  ? { opacity: 0.4 }
                  : { opacity: 1 },
                { borderRadius: 10 },
              ]}
              click_Done={() => this.click_FirstQuestion()}
            />
          </View>
        </KeyboardAwareScrollView>
        <ModelLoader loading={flag_Loading} color={colors.appColor} size={30} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewPagination: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  viewInputFiled: {
    flex: 3,
    alignItems: 'center',
    margin: 10,
  },
  itemInputWalletName: {
    width: Dimensions.get('screen').width / 1.07,
    borderWidth: 0,
    borderRadius: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    height: 50,
  },
  itemQuestionPicker: {
    width: Dimensions.get('screen').width / 1.07,
    borderWidth: Platform.OS == 'ios' ? 0 : 0.1,
    borderRadius: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    height: 50,
  },
  viewProcedBtn: {
    flex: 2,
    justifyContent: 'flex-end',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    setupAccounts: () => {
      dispatch(setupAccounts());
    },
  };
};

const mapStateToProps = state => {
  return {
    setUpAccounts: {
      mnemonic: state.walletReducer.mnemonic,
      regularAccount: state.walletReducer.regularAccount,
      secureAccount: state.walletReducer.secureAccount,
      sss: state.walletReducer.sss,
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FirstSecretQuestion);