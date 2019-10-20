import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native';
import { Container, Text } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';

// TODO: Custome object
import { colors, images, localDB } from 'hexaConstants';

// Custome Compontes
import { CustomStatusBar } from 'hexaCustStatusBar';
import { HeaderTitle } from 'hexaCustHeader';

// TODO: Custome Alert
import { AlertSimple } from 'hexaCustAlert';

// TODO: Custome Pages
import { ModelLoader } from 'hexaLoader';

// TODO: Bitcoin files
import { S3Service } from 'hexaBitcoin';

const dbOpration = require('hexaDBOpration');

const alert = new AlertSimple();

// TODO: Common Funciton
const comFunDBRead = require('hexaCommonDBReadData');

let flag_ReadQRCode = true;

export default class RestoreTrustedContactsQRCodeScan extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      flag_Loading: false,
    };
  }

  UNSAFE_componentWillMount() {
    const data = this.props.navigation.getParam('data');
    this.setState({
      data,
    });
  }

  _renderTitleBar() {
    return <Text />;
  }

  _renderMenu() {
    return <Text />;
  }

  click_ResetFlagRead = () => {
    flag_ReadQRCode = true;
    this.props.navigation.pop();
  };

  barcodeReceived = async (e: any) => {
    try {
      let result = e.data;
      result = JSON.parse(result);
      const { data } = this.state;
      console.log({ data, result });
      const dateTime = Date.now();
      if (result.type == 'SSS Restore QR') {
        const resDownlaodShare = await S3Service.downloadShare(result.data);
        console.log({ resDownlaodShare });
        if (resDownlaodShare.status == 200) {
          const resDecryptEncMetaShare = await S3Service.decryptEncMetaShare(
            resDownlaodShare.data.encryptedMetaShare,
            result.data,
          );
          console.log({ resDecryptEncMetaShare });
          if (resDecryptEncMetaShare.status == 200) {
            const resUpdateSSSRetoreDecryptedShare = await dbOpration.updateSSSRetoreDecryptedShare(
              localDB.tableName.tblSSSDetails,
              resDecryptEncMetaShare.data.decryptedMetaShare,
              dateTime,
              data.sssDetails.id,
            );
            console.log({ resUpdateSSSRetoreDecryptedShare });
            if (resUpdateSSSRetoreDecryptedShare) {
              if (flag_ReadQRCode == true) {
                flag_ReadQRCode = false;
                await comFunDBRead.readTblSSSDetails();
                this.props.navigation.pop(2);
              }
            }
          } else if (flag_ReadQRCode == true) {
            flag_ReadQRCode = false;
            alert.simpleOkAction(
              'Oops',
              resDecryptEncMetaShare.err,
              this.click_ResetFlagRead,
            );
          }
        } else if (flag_ReadQRCode == true) {
          flag_ReadQRCode = false;
          alert.simpleOkAction(
            'Oops',
            resDownlaodShare.err,
            this.click_ResetFlagRead,
          );
        }
      } else if (flag_ReadQRCode == true) {
        flag_ReadQRCode = false;
        alert.simpleOkAction(
          'Oops',
          'Please scan correct qrcode.',
          this.click_ResetFlagRead,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: GoBack
  click_GoBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onSelect({ selected: true });
  }

  render() {
    // flag
    const { flag_Loading } = this.state;
    return (
      <Container>
        <ImageBackground
          source={images.WalletSetupScreen.WalletScreen.backgoundImage}
          style={styles.container}
        >
          <HeaderTitle title="Scan QRCode" pop={() => this.click_GoBack()} />
          <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
          >
            <QRCodeScanner
              onRead={this.barcodeReceived}
              topContent={this._renderTitleBar()}
              bottomContent={this._renderMenu()}
              cameraType="back"
              showMarker={true}
              vibrate={true}
            />
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
  },
});