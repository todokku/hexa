import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  Platform
} from 'react-native';
import Fonts from '../../common/Fonts';
import BackupStyles from './Styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getIconByStatus } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { uploadEncMShare } from '../../store/actions/sss';
import Colors from '../../common/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RFValue } from 'react-native-responsive-fontsize';
import BottomSheet from 'reanimated-bottom-sheet';
import ModalHeader from '../../components/ModalHeader';
import HistoryPageComponent from '../../components/HistoryPageComponent';
import SecondaryDevice from './SecondaryDevice';
import moment from 'moment';
import _ from 'underscore';
import TestAccountHelperModalContents from '../../components/Helper/TestAccountHelperModalContents';
import ErrorModalContents from '../../components/ErrorModalContents';
import DeviceInfo from 'react-native-device-info';

const SecondaryDeviceHistory = props => {
  const [secondaryDeviceHistory, setSecondaryDeviceHistory] = useState([
    {
      id: 1,
      title: 'Recovery Secret created',
      date: null,
      info: 'Lorem ipsum dolor Lorem dolor sit amet, consectetur dolor sit',
    },
    {
      id: 2,
      title: 'Recovery Secret in-transit',
      date: null,
      info:
        'consectetur adipiscing Lorem ipsum dolor sit amet, consectetur sit amet',
    },
    {
      id: 3,
      title: 'Recovery Secret accessible',
      date: null,
      info: 'Lorem ipsum dolor Lorem dolor sit amet, consectetur dolor sit',
    },
    {
      id: 4,
      title: 'Recovery Secret not accessible',
      date: null,
      info: 'Lorem ipsum Lorem ipsum dolor sit amet, consectetur sit amet',
    },
    // {
    //   id: 5,
    //   title: 'Recovery Secret In-Transit',
    //   date: '20 May ‘19, 11:00am',
    //   info: 'Lorem ipsum dolor Lorem dolor sit amet, consectetur dolor sit',
    // },
    // {
    //   id: 6,
    //   title: 'Recovery Secret Not Accessible',
    //   date: '19 May ‘19, 11:00am',
    //   info: 'Lorem ipsum dolor Lorem dolor sit amet, consectetur dolor sit',
    // },
  ]);
  const [secondaryDeviceBottomSheet, setSecondaryDeviceBottomSheet] = useState(
    React.createRef(),
  );
  const [secondaryDeviceMessageBottomSheet, setSecondaryDeviceMessageBottomSheet] = useState(
    React.createRef(),
  );
  const [secondaryQR, setSecondaryQR] = useState('');
  const [isReshare, setIsReshare] = useState(false);
  const SHARES_TRANSFER_DETAILS = useSelector(
    state =>
      state.storage.database.DECENTRALIZED_BACKUP.SHARES_TRANSFER_DETAILS,
  );
  const WALLET_SETUP = useSelector(
    state => state.storage.database.WALLET_SETUP,
  );

  const uploadMetaShare = useSelector(
    state => state.sss.loading.uploadMetaShare,
  );

  const updateAutoHighlightFlags = props.navigation.getParam(
    'updateAutoHighlightFlags',
  );
  const next = props.navigation.getParam('next');

  const saveInTransitHistory = async () => {
    const shareHistory = JSON.parse(await AsyncStorage.getItem('shareHistory'));
    if (shareHistory) {
      const updatedShareHistory = [...shareHistory];
      updatedShareHistory[0] = {
        ...updatedShareHistory[0],
        inTransit: Date.now(),
      };
      updateHistory(updatedShareHistory);
      await AsyncStorage.setItem(
        'shareHistory',
        JSON.stringify(updatedShareHistory),
      );
    }
  };

  const renderSecondaryDeviceContents = useCallback(() => {
    return (
      <SecondaryDevice
        secondaryQR={secondaryQR}
        uploadMetaShare={uploadMetaShare}
        onPressOk={async () => {
          updateAutoHighlightFlags();
          saveInTransitHistory();
          (secondaryDeviceBottomSheet as any).current.snapTo(0);
          if (next) {
            props.navigation.goBack();
          }
          setTimeout(() => {
            setIsReshare(true);
          }, 2);
        }}
        onPressBack={() => {
          (secondaryDeviceBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  }, [secondaryQR, uploadMetaShare]);

  const renderSecondaryDeviceHeader = useCallback(() => {
    return (
      <ModalHeader
        onPressHeader={() => {
          (secondaryDeviceBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  }, []);
  const renderSecondaryDeviceMessageContents = useCallback(() => {
    return (
      <ErrorModalContents
        modalRef={secondaryDeviceMessageBottomSheet}
        title={`Secondary Device`}
        note={
          'For confirming your Recovery Secret on the Secondary Device, simply open the app on that device and log in'
        }
        proceedButtonText={'Ok, got it'}
        onPressProceed={() => {
          if (secondaryDeviceMessageBottomSheet.current)
          (secondaryDeviceMessageBottomSheet as any).current.snapTo(0);
        }}
        onPressIgnore={() => {
          if (secondaryDeviceMessageBottomSheet.current)
          (secondaryDeviceMessageBottomSheet as any).current.snapTo(0);
        }}
        isBottomImage={false}
      />
    );
  }, []);

  const renderSecondaryDeviceMessageHeader = useCallback(() => {
    return (
      <ModalHeader
        onPressHeader={() => {
          (secondaryDeviceMessageBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  }, []);

  useEffect(() => {
    if (next) (secondaryDeviceBottomSheet as any).current.snapTo(1);
  }, [next]);

  const sortedHistory = history => {
    const currentHistory = history.filter(element => {
      if (element.date) return element;
    });

    const sortedHistory = _.sortBy(currentHistory, 'date');
    sortedHistory.forEach(element => {
      element.date = moment(element.date)
        .utc()
        .local()
        .format('DD MMMM YYYY HH:mm');
    });

    return sortedHistory;
  };

  const updateHistory = shareHistory => {
    const updatedSecondaryHistory = [...secondaryDeviceHistory];
    if (shareHistory[0].createdAt)
      updatedSecondaryHistory[0].date = shareHistory[0].createdAt;
    if (shareHistory[0].inTransit)
      updatedSecondaryHistory[1].date = shareHistory[0].inTransit;

    if (shareHistory[0].accessible)
      updatedSecondaryHistory[2].date = shareHistory[0].accessible;

    if (shareHistory[0].notAccessible)
      updatedSecondaryHistory[3].date = shareHistory[0].notAccessible;
    setSecondaryDeviceHistory(updatedSecondaryHistory);
  };

  useEffect(() => {
    (async () => {
      const shareHistory = JSON.parse(
        await AsyncStorage.getItem('shareHistory'),
      );
      if (shareHistory[0].inTransit) {
        setIsReshare(true);
      }
      if (shareHistory) updateHistory(shareHistory);
    })();
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    if (SHARES_TRANSFER_DETAILS[0]) {
      if (Date.now() - SHARES_TRANSFER_DETAILS[0].UPLOADED_AT > 600000) {
        dispatch(uploadEncMShare(0));
      } else {
        // do nothing
      }
      setSecondaryQR(
        JSON.stringify({
          requester: WALLET_SETUP.walletName,
          ...SHARES_TRANSFER_DETAILS[0],
          type: 'secondaryDeviceQR',
        }),
      );
    } else {
      dispatch(uploadEncMShare(0));
    }
  }, [SHARES_TRANSFER_DETAILS]);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: Colors.backgroundColor }}
      />
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <View
        style={{
          ...styles.modalHeaderTitleView,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
            style={{ height: 30, width: 30, justifyContent: 'center' }}
          >
            <FontAwesome name="long-arrow-left" color={Colors.blue} size={17} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginRight: 10,
            }}
          >
            <Image
              style={{
                width: wp('9%'),
                height: wp('9%'),
                resizeMode: 'contain',
                alignSelf: 'center',
                marginRight: 8,
              }}
              source={require('../../assets/images/icons/icon_secondarydevice.png')}
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={BackupStyles.modalHeaderTitleText}>
                {props.navigation.state.params.selectedTitle}
              </Text>
              <Text style={BackupStyles.modalHeaderInfoText}>
                Last backup{' '}
                <Text
                  style={{
                    fontFamily: Fonts.FiraSansMediumItalic,
                    fontWeight: 'bold',
                  }}
                >
                  {' '}
                  {props.navigation.state.params.selectedTime}
                </Text>
              </Text>
            </View>
            <Image
              style={{
                width: isReshare ? 14 : 17,
                height: isReshare ? 16 : 17,
                resizeMode: 'contain',
                marginLeft: 'auto',
                alignSelf: 'center',
              }}
              source={
                isReshare
                  ? getIconByStatus(
                      props.navigation.state.params.selectedStatus,
                    )
                  : require('../../assets/images/icons/settings.png')
              }
            />
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <HistoryPageComponent
          type={'secondaryDevice'}
          IsReshare={isReshare}
          data={sortedHistory(secondaryDeviceHistory)}
          onPressConfirm={() => {
            (secondaryDeviceMessageBottomSheet as any).current.snapTo(1);
          }}
          onPressContinue={() => {
            (secondaryDeviceBottomSheet as any).current.snapTo(1);
          }}
        />
      </View>
      <BottomSheet
        onCloseStart={() => {
          secondaryDeviceBottomSheet.current.snapTo(0);
        }}
        enabledInnerScrolling={true}
        ref={secondaryDeviceBottomSheet}
        snapPoints={[-30, hp('85%')]}
        renderContent={renderSecondaryDeviceContents}
        renderHeader={renderSecondaryDeviceHeader}
      />
      <BottomSheet
        onCloseStart={() => {
          secondaryDeviceMessageBottomSheet.current.snapTo(0);
        }}
        enabledInnerScrolling={true}
        ref={secondaryDeviceMessageBottomSheet}
        snapPoints={[-50,
          Platform.OS == 'ios' && DeviceInfo.hasNotch() ? hp('35%') : hp('40%'),]}
        renderContent={renderSecondaryDeviceMessageContents}
        renderHeader={renderSecondaryDeviceMessageHeader}
      />
    </View>
  );
};

export default SecondaryDeviceHistory;

const styles = StyleSheet.create({
  modalHeaderTitleText: {
    color: Colors.blue,
    fontSize: RFValue(18),
    fontFamily: Fonts.FiraSansRegular,
  },
  modalHeaderTitleView: {
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10,
    paddingBottom: hp('3%'),
    marginTop: 20,
    marginBottom: 15,
  },
});
