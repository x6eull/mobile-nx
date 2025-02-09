import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { FontSize, Color, FontFamily, Gap, Padding } from "../GlobalStyles";

const Frame1 = () => {
  return (
    <View style={styles.frameParent}>
      <View style={styles.parent}>
        <Text style={styles.text}>跑步打卡</Text>
        <Text style={[styles.text1, styles.textTypo]}>东操</Text>
      </View>
      <Text style={[styles.text2, styles.textTypo]}>17:00-17:30</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    fontSize: FontSize.size_sm,
    color: Color.colorBlack,
    fontFamily: FontFamily.robotoMedium,
    fontWeight: "500",
    letterSpacing: 0,
  },
  text: {
    fontSize: FontSize.size_lg,
    textAlign: "left",
    color: Color.colorBlack,
    fontFamily: FontFamily.robotoMedium,
    fontWeight: "500",
    letterSpacing: 0,
  },
  text1: {
    textAlign: "left",
  },
  parent: {
    gap: Gap.gap_md,
  },
  text2: {
    textAlign: "right",
  },
  frameParent: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: Color.colorWhite,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_xs,
    paddingVertical: 0,
  },
});

export default Frame1;