import React, { useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import Fonts from "../../../common/Fonts";
import Colors from "../../../common/Colors";
import BackupStyles from "./Styles";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";

const Cloud = props => {
  const [selectedStatus, setSelectedStatus] = useState("Ugly"); // for preserving health of this entity
  const [cloudData, setCloudData] = useState([
    {
      title: "iCloud Drive",
      info: "Store backup in iCloud Drive",
      imageIcon: require("../../../assets/images/icons/logo_brand_brands_logos_icloud.png")
    },
    {
      title: "Google Drive",
      info: "Store backup in Google Drive",
      imageIcon: require("../../../assets/images/icons/logo_brand_brands_logos_icloud.png")
    },
    {
      title: "One Drive",
      info: "Store backup in One Drive",
      imageIcon: require("../../../assets/images/icons/logo_brand_brands_logos_icloud.png")
    },
    {
      title: "DropBox Storage",
      info: "Store backup in Dropbox Storage",
      imageIcon: require("../../../assets/images/icons/logo_brand_brands_logos_icloud.png")
    }
  ]);

  return (
    <View style={BackupStyles.modalContainer}>
      <View style={BackupStyles.modalHeaderTitleView}>
        <View style={{ marginTop: hp("2%") }}>
          <Text style={BackupStyles.modalHeaderTitleText}>Cloud</Text>
          <Text style={BackupStyles.modalHeaderInfoText}>Never backed up</Text>
        </View>
        <Image
          style={BackupStyles.cardIconImage}
          source={props.getIconByStatus(selectedStatus)}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            marginLeft: 30,
            color: Colors.textColorGrey,
            fontFamily: Fonts.FiraSansRegular,
            fontSize: RFValue(12),
            marginTop: 5,
            marginBottom: 5
          }}
        >
          Select cloud drive to{" "}
          <Text
            style={{
              fontFamily: Fonts.FiraSansMediumItalic,
              fontWeight: "bold"
            }}
          >
            store recovery secret
          </Text>
        </Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={cloudData}
            renderItem={({ item, index }) => (
              <View style={styles.listElements}>
                <Image
                  style={styles.listElementsIconImage}
                  source={item.imageIcon}
                />
                <View style={{ justifyContent: "space-between", flex: 1 }}>
                  <Text style={styles.listElementsTitle}>{item.title}</Text>
                  <Text style={styles.listElementsInfo} numberOfLines={1}>
                    {item.info}
                  </Text>
                </View>
                <View style={styles.listElementIcon}>
                  <Ionicons
                    name="ios-arrow-forward"
                    color={Colors.textColorGrey}
                    size={15}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listElements: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderColor,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 10,
    alignItems: "center"
  },
  listElementsTitle: {
    color: Colors.blue,
    fontSize: RFValue(13),
    marginLeft: 13,
    fontFamily: Fonts.FiraSansRegular
  },
  listElementsInfo: {
    color: Colors.textColorGrey,
    fontSize: RFValue(11),
    marginLeft: 13,
    marginTop: 5,
    fontFamily: Fonts.FiraSansRegular
  },
  listElementIcon: {
    paddingRight: 5,
    marginLeft: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  listElementsIconImage: {
    resizeMode: "contain",
    width: 25,
    height: 25,
    alignSelf: "center"
  }
});

export default Cloud;
