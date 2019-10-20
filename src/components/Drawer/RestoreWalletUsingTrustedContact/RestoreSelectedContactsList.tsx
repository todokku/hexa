/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Container, Text } from 'native-base';
import { RkCard } from 'react-native-ui-kitten';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Avatar } from 'react-native-elements';

// TODO: Custome Pages
import { ImageSVG } from 'hexaCustImage';

import { CustomStatusBar } from 'hexaCustStatusBar';
import { HeaderTitle } from 'hexaCustHeader';
import { ModelLoader } from 'hexaLoader';
import { FullLinearGradientButton } from 'hexaCustomeLinearGradientButton';

// TODO: Custome StyleSheet Files
import FontFamily from 'hexaStyles';

// TODO: Custome Object
import { colors, images, svgIcon } from 'hexaConstants';
import { renderIf } from 'hexaValidation';

const utils = require('hexaUtils');

let counterConfirm = 0;

export default class RestoreSelectedContactsList extends React.Component<
  any,
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {
      arr_TrustedContacts: [
        {
          thumbnailPath: 'user',
          givenName: 'Trusted Contacts 1',
          familyName: '',
          statusMsgColor: '#ff0000',
          statusMsg: 'Not confirmed',
          opt: undefined,
        },
        {
          thumbnailPath: 'user',
          givenName: 'Trusted Contacts 2',
          familyName: '',
          statusMsgColor: '#ff0000',
          statusMsg: 'Not confirmed',
          opt: undefined,
        },
      ],
      arr_SelfShare: [
        {
          thumbnailPath: Platform.OS == 'ios' ? 'walletSVG' : 'walletPNG',
          givenName: 'Wallet',
          familyName: '',
          statusMsgColor: '#ff0000',
          statusMsg: 'Not confirmed',
        },
        {
          thumbnailPath: Platform.OS == 'ios' ? 'emailSVG' : 'emailPNG',
          givenName: 'Email',
          familyName: '',
          statusMsgColor: '#ff0000',
          statusMsg: 'Not confirmed',
        },
        {
          thumbnailPath:
            Platform.OS == 'ios' ? 'cloudstorageSVG' : 'cloudstoragePNG',
          givenName: 'iCloud',
          familyName: '',
          statusMsgColor: '#ff0000',
          statusMsg: 'Not confirmed',
        },
      ],
      // flag
      flag_isTrustedContacts: true,
      flag_SelfShare: true,
      flag_SelfShareDisable: true,
      flag_isSetupTrustedContact: true,
      flag_DisableBtnNext: true,
      flag_Loading: false,
    };
  }

  async UNSAFE_componentWillMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        counterConfirm = 0;
        this.loaddata();
      },
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getTrustedContactInfo = async (sssDetails: any) => {
    const keeperInfo = JSON.parse(sssDetails.keeperInfo);
    console.log({ keeperInfo });
    const data = {};
    data.emailAddresses = keeperInfo.emailAddresses;
    data.phoneNumbers = keeperInfo.phoneNumbers;
    data.history = JSON.parse(sssDetails.history);
    data.recordID = keeperInfo.recordID;
    data.thumbnailPath = keeperInfo.thumbnailPath;
    data.givenName = keeperInfo.givenName;
    data.familyName = keeperInfo.familyName;
    data.sssDetails = sssDetails;
    const { sharedDate } = sssDetails;
    if (sharedDate == '' && sssDetails.shareStage == '') {
      data.statusMsg = 'Not Confirmed';
      data.statusMsgColor = '#ff0000';
    } else if (sharedDate != '' && sssDetails.shareStage == '') {
      data.statusMsg = 'Shared';
      data.statusMsgColor = '#C07710';
    } else {
      counterConfirm += 1;
      data.statusMsg = 'Confirmed';
      data.statusMsgColor = '#008000';
    }
    console.log({ data });

    return [data];
  };

  loaddata = async () => {
    this.setState({
      flag_Loading: true,
    });
    let flag_Loading = true;
    const dateTime = Date.now();
    const walletDetails = await utils.getWalletDetails();
    const sssDetails = await utils.getSSSDetails();
    console.log(sssDetails);
    console.log({ sssDetails });
    console.log({ walletDetails, sssDetails });
    // flag
    let flag_isSetupTrustedContact;
    let flag_isSecretQuestions;
    // array
    const history = [];
    const tempOpt = [];
    const temp = [];
    // Trusted Contacts

    if (sssDetails.length > 0) {
      const { arr_TrustedContacts, arr_SelfShare } = this.state;
      const len = sssDetails.length;
      for (let i = 0; i < len; i++) {
        // Trusted Contacts
        if (
          sssDetails[i].type === 'Trusted Contacts 1' &&
          sssDetails[i].keeperInfo != ''
        ) {
          const data = await this.getTrustedContactInfo(sssDetails[i]);
          arr_TrustedContacts[0] = data[0];
        } else if (
          sssDetails[i].type === 'Trusted Contacts 2' &&
          sssDetails[i].keeperInfo != ''
        ) {
          const data = await this.getTrustedContactInfo(sssDetails[i]);
          arr_TrustedContacts[1] = data[0];
        }

        // Self Share
        else if (
          sssDetails[i].type === 'Self Share 1' &&
          sssDetails[i].decryptedShare != ''
        ) {
          const { sharedDate } = sssDetails[i];
          const { shareStage } = sssDetails[i];
          const statusMsg = this.getMsgAndColor(sharedDate, shareStage)[0];
          const statusColor = this.getMsgAndColor(sharedDate, shareStage)[1];
          if (statusMsg == 'Confirmed') {
            counterConfirm += 1;
          }
          const data = {};
          data.thumbnailPath = Platform.OS == 'ios' ? 'walletSVG' : 'walletPNG';
          data.givenName = 'Wallet';
          data.familyName = '';
          data.statusMsgColor = statusColor;
          data.statusMsg = statusMsg;
          data.sssDetails = sssDetails[i];
          arr_SelfShare[0] = data;
        } else if (
          sssDetails[i].type === 'Self Share 2' &&
          sssDetails[i].decryptedShare != ''
        ) {
          const { sharedDate } = sssDetails[i];
          const { shareStage } = sssDetails[i];
          const statusMsg = this.getMsgAndColor(sharedDate, shareStage)[0];
          const statusColor = this.getMsgAndColor(sharedDate, shareStage)[1];
          if (statusMsg == 'Confirmed') {
            counterConfirm += 1;
          }
          const data = {};
          data.thumbnailPath = Platform.OS == 'ios' ? 'emailSVG' : 'emailPNG';
          data.givenName = 'Email';
          data.familyName = '';
          data.statusMsgColor = statusColor;
          data.statusMsg = statusMsg;
          data.sssDetails = sssDetails[i];
          arr_SelfShare[1] = data;
        } else {
          const { sharedDate } = sssDetails[i];
          const { shareStage } = sssDetails[i];
          const statusMsg = this.getMsgAndColor(sharedDate, shareStage)[0];
          const statusColor = this.getMsgAndColor(sharedDate, shareStage)[1];
          if (statusMsg == 'Confirmed') {
            counterConfirm += 1;
          }
          const data = {};
          data.thumbnailPath =
            Platform.OS == 'ios' ? 'cloudstorageSVG' : 'cloudstoragePNG';
          data.givenName = 'iCloud';
          data.familyName = '';
          data.statusMsgColor = statusColor;
          data.statusMsg = statusMsg;
          data.sssDetails = sssDetails[i];
          arr_SelfShare[2] = data;
        }
        flag_Loading = false;
        // Next Button Enable or Didable
        console.log({ counterConfirm });
        let flag_DisableBtnNext = true;
        if (counterConfirm >= 3) {
          flag_DisableBtnNext = false;
        }
        this.setState({
          flag_isSetupTrustedContact,
          arr_TrustedContacts,
          flag_isSecretQuestions,
          arr_SelfShare,
          flag_DisableBtnNext,
        });
      }
    } else {
      flag_Loading = false;
    }
    this.setState({
      flag_Loading,
    });
  };

  getMsgAndColor(sharedDate: string, shareStage: string) {
    if (sharedDate == '' && shareStage != 'Good') {
      return ['Not Confirmed', '#ff0000'];
    }
    if (sharedDate != '' && shareStage != 'Good') {
      return ['Shared', '#C07710'];
    }
    return ['Confirmed', '#008000'];
  }

  // TODO: func click_Item
  click_AssociateContactItem = (item: any) => {
    if (
      item.givenName == 'Trusted Contacts 1' ||
      item.givenName == 'Trusted Contacts 2'
    ) {
      this.props.navigation.push('RestoreAllContactList', {
        data: item.givenName,
      });
    } else {
      this.props.navigation.push('RestoreTrustedContactsShare', {
        data: item,
        title: `${item.givenName} Share`,
      });
    }
  };

  // TODO: func click_FirstMenuItem
  click_SecretQuestion(item: any) {
    const { walletDetails } = item;
    const data = JSON.parse(walletDetails.setUpWalletAnswerDetails);
    this.props.navigation.push('BackupSecretQuestions', {
      data,
      walletDetails,
    });
  }

  // TODO: click_SetupTrustedContacts
  click_SetupTrustedContacts() {
    this.setState({
      arr_ModelBackupYourWallet: [
        {
          modalVisible: true,
        },
      ],
    });
  }

  onSelect = async (returnValue: any) => {
    // let walletDetails = await utils.getWalletDetails();
    // var sssDetails = await utils.getSSSDetails();
    // let encrShares = [];
    // for ( let i = 0; i <= 2; i++ ) {
    //     encrShares.push( sssDetails[ i ].shareId )
    // }
    // console.log( { encrShares } );
    // let updateShareIdStatus = await comAppHealth.connection_AppHealthAndSSSUpdate( parseInt( walletDetails.lastUpdated ), encrShares );
    // if ( updateShareIdStatus ) {
    //     sssDetails = await utils.getSSSDetails();
    //     let arr_SelfShare = [];
    //     let arrTitle = [ "", "", "Wallet", "Email", "iCloud" ];
    //     for ( let i = 0; i < sssDetails.length; i++ ) {
    //         if ( i > 1 ) {
    //             console.log( { data: sssDetails[ i ] } );
    //             let sharedDate = sssDetails[ i ].sharedDate;
    //             let shareStage = sssDetails[ i ].shareStage;
    //             let statusMsg = this.getMsgAndColor( sharedDate, shareStage )[ 0 ];
    //             let statusColor = this.getMsgAndColor( sharedDate, shareStage )[ 1 ];
    //             console.log( { statusMsg, statusColor } );
    //             let data = {};
    //             data.thumbnailPath = "bars";
    //             data.givenName = arrTitle[ i ];
    //             data.familyName = "";
    //             data.statusMsgColor = statusColor;
    //             data.statusMsg = statusMsg;
    //             data.sssDetails = sssDetails[ i ];
    //             arr_SelfShare.push( data );
    //         }
    //     }
    //     this.setState( {
    //         arr_SelfShare
    //     } )
    // }
  };

  // TODO: Self share
  click_SelfShare = async (item: any) => {
    if (item.givenName == 'Wallet') {
      this.props.navigation.push('Restore3SelfShare', {
        data: item,
        title: `${item.givenName} Shares Scan`,
      });
    } else {
      this.props.navigation.push('Restore4And5SelfShare', {
        data: item,
        title: `${item.givenName} Shares Scan`,
        type: item.givenName,
      });
    }

    // let sssDetails = await utils.getSSSDetails();
    // console.log( { sssDetails } );
    // let data3Share = sssDetails[ 2 ];
    // var email4shareFilePath = sssDetails[ 3 ].encryptedMetaShare;

    // console.log( { email4shareFilePath } );
    // if ( item.givenName == "Wallet" ) {
    //     this.props.navigation.push( "SelfShareUsingWalletQRCode", { data: data3Share, onSelect: this.onSelect } )
    // } else if ( item.givenName == "Email" ) {
    //     this.props.navigation.push( "SelfShareSharingScreen", { data: item, title: "Email Share" } );

    // } else {
    //     this.props.navigation.push( "SelfShareSharingScreen", { data: item, title: "iCloud Share" } );
    // }
  };

  // TODO: click next button all or 3 share conrimed
  click_Next() {
    this.props.navigation.push('RestoreWalletUsingTrustedContactQueAndAnw');
  }

  render() {
    // flag
    const {
      flag_isTrustedContacts,
      flag_isSetupTrustedContact,
      flag_isMnemonic,
      flag_isSecretQuestions,
      flag_isTwoFactor,
      flag_Loading,
      flag_SelfShare,
      flag_SelfShareDisable,
      flag_DisableBtnNext,
    } = this.state;
    // TouchableOpacity
    const {
      flag_DisableSecureTwoFactor,
      flag_DisableSecretQuestion,
    } = this.state;
    // array
    const {
      arr_TrustedContacts,
      arr_SelfShare,
      arr_SecretQuestion,
    } = this.state;
    return (
      <Container>
        <ImageBackground
          source={images.WalletSetupScreen.WalletScreen.backgoundImage}
          style={styles.container}
        >
          <HeaderTitle
            title="Restore Wallet"
            pop={() =>
              this.props.navigation.navigate('RestoreAndWalletSetupNavigator')
            }
          />
          <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
          >
            <KeyboardAwareScrollView
              enableAutomaticScroll
              automaticallyAdjustContentInsets={true}
              keyboardOpeningTime={0}
              enableOnAndroid={true}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <RkCard
                rkType="shadowed"
                style={{
                  flex: 1,
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 15,
                    borderRadius: 10,
                    borderBottomColor: '#F5F5F5',
                    borderBottomWidth: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: '#ffffff',
                      margin: 5,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          FontFamily.ffFiraSansMedium,
                          {
                            marginLeft: 10,
                            fontSize: 16,
                          },
                        ]}
                      >
                        Trusted Contacts
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          note
                          style={[
                            FontFamily.ffFiraSansRegular,
                            {
                              marginLeft: 10,
                              fontSize: 14,
                            },
                          ]}
                        >
                          Shares you have trusted with your friends and family
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={arr_TrustedContacts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{}}
                        onPress={() => {
                          this.click_AssociateContactItem(item);
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#ffffff',
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 10,
                            borderRadius: 10,
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              backgroundColor: '#ffffff',
                              margin: 5,
                              borderRadius: 10,
                            }}
                          >
                            {renderIf(
                              item.givenName == 'Trusted Contacts 1' ||
                                item.givenName == 'Trusted Contacts 2',
                            )(
                              <ImageSVG
                                size={55}
                                source={
                                  Platform.OS == 'ios'
                                    ? svgIcon.healthoftheapp.selectcontactsSVG
                                    : svgIcon.healthoftheapp.selectcontactsPNG
                                }
                              />,
                            )}
                            {renderIf(
                              item.givenName != 'Trusted Contacts 1' &&
                                item.givenName != 'Trusted Contacts 2',
                            )(
                              <Avatar
                                size={55}
                                rounded
                                title={
                                  item.givenName != null &&
                                  item.givenName.charAt(0)
                                }
                                titleStyle={{
                                  color: colors.appColor,
                                }}
                              />,
                            )}
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}
                            >
                              <Text
                                numberOfLines={1}
                                style={[
                                  FontFamily.ffFiraSansMedium,
                                  {
                                    marginLeft: 10,
                                    fontSize: 14,
                                  },
                                ]}
                              >
                                {item.givenName} {item.familyName}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                }}
                              >
                                <Text
                                  style={[
                                    FontFamily.ffFiraSansRegular,
                                    {
                                      marginLeft: 10,
                                      fontSize: 14,
                                      color: item.statusMsgColor,
                                    },
                                  ]}
                                >
                                  {item.statusMsg}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flex: 0.1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                              }}
                            >
                              <IconFontAwe
                                name="angle-right"
                                style={{
                                  fontSize: 25,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.recordID}
                    extraData={this.state}
                  />
                </View>
              </RkCard>

              <RkCard
                rkType="shadowed"
                style={{
                  flex: 3,
                  margin: 5,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 16,
                    borderRadius: 10,
                    borderBottomColor: '#F5F5F5',
                    borderBottomWidth: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: '#ffffff',
                      margin: 5,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          FontFamily.ffFiraSansMedium,
                          {
                            marginLeft: 10,
                            fontSize: 16,
                          },
                        ]}
                      >
                        Self Share
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          note
                          style={[
                            FontFamily.ffFiraSansRegular,
                            {
                              marginLeft: 10,
                              fontSize: 14,
                            },
                          ]}
                        >
                          Shares you self guard on multiple devices and
                          platforms.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={arr_SelfShare}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{}}
                        onPress={() => {
                          this.click_SelfShare(item);
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#ffffff',
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 10,
                            borderRadius: 10,
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              backgroundColor: '#ffffff',
                              margin: 5,
                              borderRadius: 10,
                            }}
                          >
                            <ImageSVG
                              size={55}
                              source={
                                svgIcon.healthoftheapp[item.thumbnailPath]
                              }
                            />
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}
                            >
                              <Text
                                style={[
                                  FontFamily.ffFiraSansMedium,
                                  {
                                    marginLeft: 10,
                                    fontSize: 14,
                                  },
                                ]}
                              >
                                {item.givenName} {item.familyName}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                }}
                              >
                                <Text
                                  style={[
                                    FontFamily.ffFiraSansRegular,
                                    {
                                      marginLeft: 10,
                                      fontSize: 14,
                                      color: item.statusMsgColor,
                                    },
                                  ]}
                                >
                                  {item.statusMsg}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'column',
                                  flex: 1,
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  note
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  Last assessed on
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  4/11/2019 12:23
                                </Text>
                              </View>
                              <IconFontAwe
                                name="angle-right"
                                style={{
                                  fontSize: 25,
                                  marginRight: 10,
                                  flex: 0.1,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.recordID}
                    extraData={this.state}
                  />
                </View>
              </RkCard>

              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'flex-end',
                }}
              >
                <FullLinearGradientButton
                  click_Done={() => this.click_Next()}
                  title="Next"
                  disabled={flag_DisableBtnNext}
                  style={[
                    flag_DisableBtnNext == true
                      ? { opacity: 0.4 }
                      : { opacity: 1 },
                    { borderRadius: 10 },
                  ]}
                />
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </ImageBackground>
        <ModelLoader loading={flag_Loading} color={colors.appColor} size={30} />
        <CustomStatusBar
          backgroundColor={colors.white}
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
    backgroundColor: '#F8F8F8',
  },
});