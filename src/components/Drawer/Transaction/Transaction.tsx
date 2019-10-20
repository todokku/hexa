import React from 'react';

import {
  StyleSheet,
  ImageBackground,
  View,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container, Button, Text } from 'native-base';
import { RkCard } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ImageSVG } from 'hexaCustImage';
import { SvgIcon } from '@up-shared/components';

// TODO: Custome Object
import { images, colors, svgIcon } from 'hexaConstants';

// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';

// TODO: Custome Pages
import { CustomStatusBar } from 'hexaCustStatusBar';
import { ModelLoader } from 'hexaLoader';

// TODO: Custome Compontes

import { FullLinearGradientTransactionScreenThreeOpt } from 'hexaCustomeLinearGradientButton';
// TODO: Custome Alert
import { AlertSimple } from 'hexaCustAlert';

const utils = require('hexaUtils');

const alert = new AlertSimple();

// TODO: Common Funciton
const comFunTran = require('hexaCommonTransaction');

// TODO: Bitcoin Class
const bitcoinClassState = require('hexaClassState');

export default class Transaction extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      arrSelectedAccount: [],
      walletDetails: [],
      appHealthInfo: {},
      arrTransaction: [],
      flag_Loading: false,
    };
  }

  UNSAFE_componentWillMount() {
    const data = this.props.navigation.getParam('data');
    const walletDetails = this.props.navigation.getParam('walletDetails');
    const appHealthInfo = JSON.parse(walletDetails.appHealthStatus);
    console.log({ accoundDetappInfo: appHealthInfo });
    console.log({ data });
    this.setState(
      {
        arrSelectedAccount: data,
        walletDetails,
        appHealthInfo,
      },
      () => {
        this.getRegularTransaction();
      },
    );
  }

  click_StopLoader = () => {
    this.setState({ flag_Loading: false });
  };

  async getRegularTransaction() {
    const { arrSelectedAccount } = this.state;
    this.setState({ flag_Loading: true });
    let resTransaction = [];
    if (arrSelectedAccount.accountType == 'Regular Account') {
      resTransaction = await comFunTran.getSecAccountTran('Regular');
      // resTransaction.length != 0 ? resTransaction : resTransaction = await this.getAccountTrans( "Regular" )
      // console.log( { resTransaction } );
    } else {
      resTransaction = await comFunTran.getSecAccountTran('Secure');
      // / resTransaction.length != 0 ? resTransaction : resTransaction = await this.getAccountTrans( "Secure" )
    }
    this.setState({
      flag_Loading: false,
      arrTransaction: resTransaction,
    });
  }

  getNewTrnasaction = async () => {
    this.setState({ flag_Loading: true });
    let resTransaction = [];
    const { arrSelectedAccount } = this.state;
    if (arrSelectedAccount.accountType == 'Regular Account') {
      resTransaction = await this.getAccountTrans('Regular');
    } else {
      resTransaction = await this.getAccountTrans('Secure');
    }
    this.setState({
      flag_Loading: false,
      arrTransaction: resTransaction,
    });
  };

  getAccountTrans = async (type: string) => {
    await comFunTran.getAccountTransaction();
    const regularAccount = await bitcoinClassState.getRegularClassState();
    const secureAccount = await bitcoinClassState.getSecureClassState();
    let resTransaction = [];
    if (type == 'Regular') {
      resTransaction = await regularAccount.getTransactions();
      if (resTransaction.status == 200) {
        return resTransaction.data.transactions.transactionDetails;
      }
      alert.simpleOkAction('Oops', resTransaction.err, this.click_StopLoader);
    } else {
      resTransaction = await secureAccount.getTransactions();
      if (resTransaction.status == 200) {
        return resTransaction.data.transactions.transactionDetails;
      }
      alert.simpleOkAction('Oops', resTransaction.err, this.click_StopLoader);
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ padding: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <ImageSVG
              size={50}
              source={
                svgIcon.walletScreen[
                  item.accountType == 'Regular'
                    ? Platform.OS == 'ios'
                      ? 'dailyAccountSVG'
                      : 'dailyAccountPNG'
                    : Platform.OS == 'ios'
                    ? 'secureAccountSVG'
                    : 'secureAccountPNG'
                ]
              }
            />
          </View>
          <View style={{ flex: 1, padding: 5 }}>
            <Text
              style={{
                color: '#151515',
                fontWeight: '600',
                fontSize: 14,
                paddingVertical: 3,
              }}
            >
              {item.transactionType === 'Received'
                ? `To ${item.accountType} Account`
                : `From ${item.accountType} Account`}
            </Text>
            <Text
              style={{
                color: '#8B8B8B',
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {'-'}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <Icon
              name={
                item.transactionType === 'Received'
                  ? 'long-arrow-down'
                  : 'long-arrow-up'
              }
              color={
                item.transactionType === 'Received' ? '#51B48A' : '#E64545'
              }
              size={25}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SvgIcon name="icon_more" color="#E2E2E2" size={50} />
          </View>
          <View style={styles.amountView}>
            <SvgIcon name="icon_bitcoin" color="#d0d0d0" size={30} />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: '#2F2F2F',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                {item.amount}
                <Text note> sats</Text>
              </Text>
              <Text
                style={{
                  color: '#D0D0D0',
                  fontSize: 15,
                  fontWeight: '600',
                  paddingHorizontal: 10,
                }}
              >
                {item.confirmations}
              </Text>
            </View>

            <SvgIcon name="icon_forword" color="#C4C4C4" size={18} />
          </View>
        </View>
      </View>
    );
  };

  render() {
    // array
    const { arrSelectedAccount, appHealthInfo, arrTransaction } = this.state;
    // flag
    const { flag_Loading } = this.state;
    return (
      <Container>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.appColor }} />
        <ImageBackground
          source={images.WalletSetupScreen.WalletScreen.backgoundImage}
          style={styles.container}
        >
          <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
          >
            <View
              style={[
                utils.getIphoneSize() == 'iphone X'
                  ? { flex: 0.8 }
                  : { flex: 1.3 },
                { backgroundColor: colors.appColor },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  margin: StatusBar.currentHeight,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <Button
                    hitSlop={{
                      top: 20,
                      bottom: 10,
                      left: 20,
                      right: -20,
                    }}
                    style={Platform.OS == 'ios' ? { margin: 10 } : null}
                    transparent
                    onPress={() =>
                      this.props.navigation.navigate('TabbarBottom')
                    }
                  >
                    <SvgIcon name="icon_back" size={25} color="#ffffff" />
                  </Button>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    alignItems: 'flex-end',
                  }}
                >
                  <ImageSVG
                    size={60}
                    source={
                      Platform.OS == 'ios'
                        ? svgIcon.transactionScreen[
                            `SVG${appHealthInfo.overallStatus}`
                          ]
                        : svgIcon.transactionScreen[
                            `PNG${appHealthInfo.overallStatus}`
                          ]
                    }
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 0.3 }}>
              <RkCard
                rkType="shadowed"
                style={{
                  flex: 1,
                  margin: 10,
                  marginTop: -120,
                  borderRadius: 10,
                }}
              >
                <View
                  rkCardHeader
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    borderBottomColor: '#F5F5F5',
                    borderBottomWidth: 1,
                  }}
                >
                  <ImageSVG
                    size={50}
                    source={svgIcon.walletScreen[arrSelectedAccount.svgIcon]}
                  />
                  <Text
                    style={[
                      FontFamily.ffFiraSansMedium,
                      {
                        flex: 2,
                        fontSize: 18,
                        alignSelf: 'center',
                        marginLeft: 10,
                      },
                    ]}
                  >
                    {arrSelectedAccount.accountName}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <SvgIcon name="icon_settings" color="gray" size={15} />
                  </View>
                </View>
                <View
                  rkCardContent
                  style={{
                    flex: 0.4,
                    flexDirection: 'row',
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    <SvgIcon name="icon_bitcoin" color="gray" size={40} />
                  </View>
                  <View style={{ flex: 4 }}>
                    <Text style={[FontFamily.ffOpenSansBold, { fontSize: 30 }]}>
                      {arrSelectedAccount.balance}
                    </Text>
                  </View>
                </View>
              </RkCard>
            </View>
            <View style={{ flex: 1.8 }}>
              <KeyboardAwareScrollView
                enableAutomaticScroll
                automaticallyAdjustContentInsets={true}
                keyboardOpeningTime={0}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                      this.getNewTrnasaction();
                    }}
                  />
                }
                enableOnAndroid={true}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View style={{ flex: 1.8 }}>
                  <Text note style={{ textAlign: 'center' }}>
                    Recent Transactions
                  </Text>
                  {!flag_Loading && arrTransaction.length === 0 ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                        paddingTop: 50,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#838383',
                          marginBottom: 10,
                        }}
                      >
                        {
                          'Start transactions to see your recent transactions history.'
                        }
                      </Text>
                      <Text
                        style={[
                          FontFamily.ffFiraSansRegular,
                          {
                            textAlign: 'center',
                            marginTop: 10,
                          },
                        ]}
                      >
                        Please pull down to refresh, if all transactions are not
                        visible.
                      </Text>
                    </View>
                  ) : null}
                  <FlatList
                    style={{ flex: 1, padding: 10 }}
                    data={arrTransaction}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                      <RefreshControl
                        onRefresh={() => {
                          this.getNewTrnasaction();
                        }}
                        refreshing={false}
                      />
                    }
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
            <View
              style={[
                utils.getIphoneSize() == 'iphone X'
                  ? { flex: 0.18 }
                  : { flex: 0.4 },
              ]}
            >
              <FullLinearGradientTransactionScreenThreeOpt
                style={[{ opacity: 1 }, { borderRadius: 10, height: 55 }]}
                disabled={false}
                title="Send"
                click_Sent={() => {
                  this.props.navigation.push('SendPaymentNavigation', {
                    selectedAccount: arrSelectedAccount,
                  });
                }}
                click_Transfer={() => {
                  Alert.alert('coming soon');
                }}
                click_Recieve={() => {
                  this.props.navigation.push('RecieveNavigation', {
                    selectedAccount: arrSelectedAccount,
                  });
                }}
              />
            </View>
          </SafeAreaView>
        </ImageBackground>
        <ModelLoader
          loading={this.state.flag_Loading}
          color={colors.appColor}
          size={30}
        />
        <CustomStatusBar
          backgroundColor={colors.appColor}
          hidden={false}
          barStyle="dark-content"
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  amountView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderColor: '#EFEFEF',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
});