import React, { Component } from "react";
import {
    StyleSheet,
    View,
    AsyncStorage,
    Platform,
    Dimensions,
    Image,
    Keyboard,
    StatusBar,
    Linking,
    Alert,
    ImageBackground,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { RkCard } from "react-native-ui-kitten";
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button } from 'native-base';
import { StackActions, NavigationActions } from "react-navigation";
import IconFontAwe from "react-native-vector-icons/FontAwesome";
import Permissions from 'react-native-permissions'
import { SvgIcon } from "@up-shared/components";


import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//TODO: Custome Pages
import Loader from "HexaWallet/src/app/custcompontes/Loader/ModelLoader";
import CustomeStatusBar from "HexaWallet/src/app/custcompontes/CustomeStatusBar/CustomeStatusBar";
import ModelWalletName from "HexaWallet/src/app/custcompontes/Model/ModelRestoreWalletUsingMnemonic/ModelWalletName";
import ModelEnterAndConfirmMnemonic from "HexaWallet/src/app/custcompontes/Model/ModelRestoreWalletUsingMnemonic/ModelEnterAndConfirmMnemonic";
import ModelWalletSuccessfullyRestored from "HexaWallet/src/app/custcompontes/Model/ModelRestoreWalletUsingMnemonic/ModelWalletSuccessfullyRestored";

//TODO: Custome StyleSheet Files       
import globalStyle from "HexaWallet/src/app/manager/Global/StyleSheet/Style";

//TODO: Custome Object
import {
    colors,
    images,
    localDB,
    asyncStorageKeys
} from "HexaWallet/src/app/constants/Constants";
import utils from "HexaWallet/src/app/constants/Utils";
import Singleton from "HexaWallet/src/app/constants/Singleton";
var dbOpration = require( "HexaWallet/src/app/manager/database/DBOpration" );
import renderIf from "HexaWallet/src/app/constants/validation/renderIf";
var comAppHealth = require( "HexaWallet/src/app/manager/CommonFunction/CommonAppHealth" );

//localization
import { localization } from "HexaWallet/src/app/manager/Localization/i18n";



//TODO: Bitcoin Files
import S3Service from "HexaWallet/src/bitcoin/services/sss/S3Service";
import HealthStatus from "HexaWallet/src/bitcoin/utilities/HealthStatus"
import SecureAccount from "HexaWallet/src/bitcoin/services/accounts/SecureAccount";

export default class RestoreWalletUsingMnemonicScrren extends Component {
    constructor ( props: any ) {
        super( props );
        this.state = {
            arr_ModelWalletName: [],
            arr_ConfirmPassphrase: [],
            arr_ModelRestoreSucess: [],
            wallerName: "",
            flag_Loading: false
        };
    }

    componentDidMount() {
        this.setState( {
            arr_ModelWalletName: [
                {
                    modalVisible: true
                }
            ]
        } )
    }

    //TODO: func click_getWalletDetails
    getWalletDetails = async ( mnemonic: string, bal: any ) => {
        const dateTime = Date.now();
        // const fulldate = Math.floor( dateTime / 1000 );
        let walletName = this.state.wallerName;
        await dbOpration.insertWallet(
            localDB.tableName.tblWallet,
            dateTime,
            mnemonic,
            "",
            "",
            "",
            walletName,
            ""
        );

        const secureAccount = new SecureAccount( mnemonic );
        const resSetupSecureAccount = await secureAccount.setupSecureAccount();

        const res = await comAppHealth.check_AppHealthStausUsingMnemonic( 0, 0, null, dateTime, "mnemonic" );
        if ( res ) {
            await dbOpration.insertCreateAccount(
                localDB.tableName.tblAccount,
                dateTime,
                "",
                bal,
                "BTC",
                "Daily Wallet",
                "Daily Wallet",
                ""
            );
            const secondaryMnemonic = await secureAccount.getRecoveryMnemonic();
            let arr_SecureDetails = [];
            let secureDetails = {};
            secureDetails.setupData = resSetupSecureAccount.data.setupData;
            secureDetails.secondaryXpub = resSetupSecureAccount.data.secondaryXpub;
            secureDetails.secondaryMnemonic = secondaryMnemonic;
            secureDetails.backupDate = dateTime;
            secureDetails.title = "Active Now";
            secureDetails.addInfo = "";
            arr_SecureDetails.push( secureDetails );
            await dbOpration.insertCreateAccount(
                localDB.tableName.tblAccount,
                dateTime,
                "",
                "0.0",
                "BTC",
                "Secure Account",
                "Secure Account",
                arr_SecureDetails
            );
            AsyncStorage.setItem(
                asyncStorageKeys.rootViewController,
                "TabbarBottom"
            );
        } else {
            Alert.alert( "App health staus not updated." )
        }
    }

    //TODO: Sucess Model
    click_Skip() {
        const resetAction = StackActions.reset( {
            index: 0, // <-- currect active route from actions array
            key: null,
            actions: [
                NavigationActions.navigate( { routeName: "TabbarBottom" } )
            ]
        } );
        this.props.navigation.dispatch( resetAction );
    }

    render() {
        return (
            <View style={ styles.container }>
                <SafeAreaView style={ styles.container }>
                    <CustomeStatusBar backgroundColor={ colors.white } flagShowStatusBar={ false } barStyle="dark-content" />
                    <ImageBackground source={ images.WalletSetupScreen.WalletScreen.backgoundImage } style={ styles.container }>
                        <KeyboardAwareScrollView
                            enableAutomaticScroll
                            automaticallyAdjustContentInsets={ true }
                            keyboardOpeningTime={ 0 }
                            enableOnAndroid={ true }
                            contentContainerStyle={ { flexGrow: 1 } }
                        >
                            <ModelWalletName data={ this.state.arr_ModelWalletName } click_Confirm={ ( val ) => {
                                console.log( { val } );
                                this.setState( {
                                    wallerName: val,
                                    arr_ModelWalletName: [
                                        {
                                            modalVisible: false
                                        }
                                    ],
                                    arr_ConfirmPassphrase: [
                                        {
                                            modalVisible: true
                                        }
                                    ]
                                } )
                            }
                            }
                                pop={ () => {
                                    this.setState( {
                                        arr_ModelWalletName: [
                                            {
                                                modalVisible: false
                                            }
                                        ]
                                    } );
                                    this.props.navigation.pop()
                                } }
                            />
                            <ModelEnterAndConfirmMnemonic data={ this.state.arr_ConfirmPassphrase } loadingFlag={ ( flag: boolean ) => {
                                this.setState( { flag_Loading: flag } )
                                console.log( { flag } );
                            } } click_Confirm={ ( val: string, bal: any ) => {
                                this.getWalletDetails( val, bal );
                                this.setState( {
                                    arr_ConfirmPassphrase: [
                                        {
                                            modalVisible: false
                                        }
                                    ],
                                    arr_ModelRestoreSucess: [
                                        {
                                            modalVisible: true,
                                            walletName: this.state.wallerName,
                                            bal: bal.toString()
                                        }
                                    ]
                                } )
                            }
                            }
                                pop={ () => {
                                    this.setState( {
                                        arr_ConfirmPassphrase: [
                                            {
                                                modalVisible: false
                                            }
                                        ],
                                        arr_ModelWalletName: [
                                            {
                                                modalVisible: true
                                            }
                                        ],

                                    } );

                                } }

                            />
                            <ModelWalletSuccessfullyRestored data={ this.state.arr_ModelRestoreSucess } click_Skip={ () => {
                                this.click_Skip()
                            }
                            }
                                click_RestoreSecureAccount={ () => {
                                    this.setState( {
                                        arr_ModelRestoreSucess: [
                                            {
                                                modalVisible: false
                                            }
                                        ]
                                    } )
                                    this.props.navigation.push( "ResotreSecureAccountNavigator", { prevScreen: "RestoreWallet" } )
                                } }
                            />
                            <Loader loading={ this.state.flag_Loading } color={ colors.appColor } size={ 30 } />
                        </KeyboardAwareScrollView>
                    </ImageBackground>
                </SafeAreaView>
            </View >
        );
    }
}

let styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: "#1F8BCD"
    },
    viewSetupWallet: {
        flex: 4,
        margin: 10
    },
    viewAppLogo: {
        marginTop: 20,
        flex: 1,
        alignItems: "center",
    },
    imgAppLogo: {
        height: 70,
        width: 70
    },
    txtWhiteColor: {
        color: "#ffffff"
    }

} );