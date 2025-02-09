import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { Datepicker as RNKDatepicker } from "@ui-kitten/components";
import Rectangle from "./Rectangle";
import Frame1 from "./Frame1";
import Righticons from "../assets/right-icons.svg";
import Cameracutout from "../assets/camera-cutout.svg";
import Viewweek from "../assets/view-week.svg";
import Gridnine from "../assets/gridnine.svg";
import Bsjustifyleft1 from "../assets/bsjustifyleft1.svg";
import Line from "../assets/line.svg";
import Aioutlinehome from "../assets/aioutlinehome.svg";
import Aioutlinecalendar from "../assets/aioutlinecalendar.svg";
import Aioutlinechecksquare from "../assets/aioutlinechecksquare.svg";
import Aioutlineappstore from "../assets/aioutlineappstore.svg";
import Aioutlinesmile from "../assets/aioutlinesmile.svg";
import Addbutton from "../assets/add-button.svg";
import {
  Gap,
  Border,
  Padding,
  Color,
  FontSize,
  FontFamily,
} from "../GlobalStyles";

const Frame = () => {
  const [datePicker, setDatePicker] = useState(undefined);
  const [frameFlatList1Data, setFrameFlatList1Data] = useState([
    <Rectangle />,
    <Frame1 />,
  ]);

  return (
    <View style={styles.view}>
      <View style={styles.frame}>
        <View style={[styles.frame1, styles.frame1Position]} />
      </View>
      <View style={styles.frame2}>
        <View style={styles.frame3}>
          <View style={[styles.statusBar, styles.barFlexBox]}>
            <Text style={styles.time}>9:30</Text>
            <Righticons style={styles.rightIcons} width={46} height={17} />
            <Cameracutout
              style={[styles.cameraCutoutIcon, styles.numberLayout]}
              width={24}
              height={24}
            />
          </View>
        </View>
        <View style={styles.frame4}>
          <View style={styles.frameInner}>
            <View style={[styles.parent, styles.barFlexBox]}>
              <RNKDatepicker
                placeholder={() => (
                  <Text style={styles.datePickerPlaceHolder}>
                    2025年 三月 春5周{" "}
                  </Text>
                )}
                date={datePicker}
                onSelect={setDatePicker}
                controlStyle={styles.datePickerValue}
              />
              <View style={[styles.frameParent, styles.parentFlexBox]}>
                <View style={[styles.viewWeekParent, styles.parentFlexBox]}>
                  <Viewweek
                    style={styles.viewWeekIcon}
                    width={40}
                    height={40}
                  />
                  <View style={styles.viewWeek} />
                  <Gridnine
                    style={styles.gridNineIcon}
                    width={38}
                    height={38}
                  />
                </View>
                <Pressable
                  style={[styles.viewTodayWrapper, styles.wrapperFlexBox]}
                >
                  <Image
                    style={styles.viewWeekIcon}
                    resizeMode="cover"
                    source={require("../assets/view-today.png")}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.frame5, styles.frameLayout1]}>
        <View style={[styles.image11Parent, styles.image11ParentPosition]}>
          <Image
            style={[styles.image11Icon, styles.iconLayout]}
            resizeMode="cover"
            source={require("../assets/image-11.png")}
          />
          <View style={styles.view1}>
            <FlatList
              style={[styles.child, styles.rectangleShadowBox]}
              data={frameFlatList1Data}
              renderItem={({ item }) => item}
              contentContainerStyle={styles.frameFlatList1Content}
            />
            <View style={[styles.rectangleGroup, styles.rectangleShadowBox]}>
              <View style={[styles.frameItem, styles.frameLayout]} />
              <View style={[styles.frameContainer, styles.frameFlexBox]}>
                <View style={styles.iiParent}>
                  <Text style={[styles.ii, styles.iiTypo]}>求是潮例会</Text>
                  <View style={[styles.frameWrapper, styles.wrapperFlexBox]}>
                    <View
                      style={[
                        styles.bsjustifyleftParent,
                        styles.wrapperFlexBox,
                      ]}
                    >
                      <Bsjustifyleft1
                        style={styles.bsjustifyleftIcon}
                        width={18}
                        height={18}
                      />
                      <Text style={styles.text1}>带电脑</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.text5, styles.textTypo1]}>
                  19:00-20:30
                </Text>
              </View>
            </View>
            <View
              style={[styles.rectangleContainer, styles.rectangleShadowBox]}
            >
              <View style={[styles.rectangleView, styles.frameLayout]} />
              <View style={[styles.frameContainer, styles.frameFlexBox]}>
                <View>
                  <Text style={[styles.ii, styles.iiTypo]}>概统小测</Text>
                </View>
                <Text style={[styles.text5, styles.textTypo1]}>
                  21:30-22:35
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.frame6, styles.rightLayout]}>
          <View style={[styles.right, styles.rightLayout]}>
            <View style={[styles.right1, styles.frame1Position]}>
              <Line style={[styles.lineIcon, styles.iconPosition]} />
              <Image
                style={[styles.circleIcon, styles.iconPosition]}
                resizeMode="cover"
                source={require("../assets/circle.png")}
              />
              <View style={[styles.number, styles.iconPosition]}>
                <Text style={styles.text8}>3</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.navigationBar5, styles.image11ParentPosition]}>
          <Pressable style={styles.navItemSpaceBlock}>
            <Aioutlinehome
              style={styles.aioutlinehomeIcon}
              width={28}
              height={28}
            />
            <Text style={[styles.text9, styles.textTypo]}>主页</Text>
          </Pressable>
          <Pressable style={[styles.navItem1, styles.navItemSpaceBlock]}>
            <Aioutlinecalendar width={28} height={28} />
            <Text style={[styles.text10, styles.textTypo]}>日程</Text>
          </Pressable>
          <Pressable style={styles.navItemSpaceBlock}>
            <Aioutlinechecksquare width={28} height={28} />
            <Text style={[styles.text9, styles.textTypo]}>待办</Text>
          </Pressable>
          <Pressable style={styles.navItemSpaceBlock}>
            <Aioutlineappstore width={28} height={28} />
            <Text style={[styles.text9, styles.textTypo]}>功能</Text>
          </Pressable>
          <Pressable style={styles.navItemSpaceBlock}>
            <Aioutlinesmile width={28} height={28} />
            <Text style={[styles.text9, styles.textTypo]}>我的</Text>
          </Pressable>
        </View>
        <View style={[styles.frame7, styles.frame7Layout]}>
          <Addbutton
            style={[styles.addButtonIcon, styles.frame7Layout]}
            width={70}
            height={70}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerPlaceHolder: {
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    color: "#000",
    fontSize: 20,
  },
  datePickerValue: {},
  frameFlatList1Content: {
    flexDirection: "row",
  },
  frame1Position: {
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  barFlexBox: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  numberLayout: {
    height: 24,
    width: 24,
  },
  parentFlexBox: {
    justifyContent: "flex-end",
    gap: Gap.gap_md,
    alignItems: "center",
    flexDirection: "row",
  },
  wrapperFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameLayout1: {
    width: 554,
    overflow: "hidden",
  },
  image11ParentPosition: {
    left: 71,
    width: 412,
    position: "absolute",
  },
  iconLayout: {
    maxWidth: "100%",
    overflow: "hidden",
  },
  rectangleShadowBox: {
    borderRadius: Border.br_5xs,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
  },
  frameLayout: {
    opacity: 0.6,
    width: 12,
    height: 88,
  },
  frameFlexBox: {
    paddingHorizontal: Padding.p_xs,
    alignItems: "center",
    paddingVertical: 0,
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  iiTypo: {
    color: Color.colorBlack,
    letterSpacing: 0,
    textAlign: "left",
    fontWeight: "500",
  },
  textTypo1: {
    textAlign: "right",
    color: Color.colorBlack,
    letterSpacing: 0,
    fontWeight: "500",
    fontSize: FontSize.size_sm,
  },
  rightLayout: {
    height: 164,
    position: "absolute",
  },
  iconPosition: {
    top: "50%",
    position: "absolute",
  },
  textTypo: {
    fontSize: FontSize.size_xs,
    textAlign: "center",
    fontFamily: FontFamily.robotoRegular,
    lineHeight: 20,
  },
  navItemSpaceBlock: {
    gap: Gap.gap_lg,
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: 0,
    width: 70,
    alignItems: "center",
    overflow: "hidden",
  },
  frame7Layout: {
    height: 70,
    position: "absolute",
  },
  frame1: {
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: Color.color1,
    borderWidth: 3,
  },
  frame: {
    top: 70,
    left: 10,
    width: 397,
    height: 53,
    display: "none",
    position: "absolute",
  },
  time: {
    letterSpacing: 0.1,
    color: Color.schemesOnSurface,
    zIndex: 0,
    textAlign: "left",
    fontWeight: "500",
    lineHeight: 20,
    fontFamily: FontFamily.robotoMedium,
    fontSize: FontSize.size_sm,
  },
  rightIcons: {
    zIndex: 1,
  },
  cameraCutoutIcon: {
    marginLeft: -12,
    top: 18,
    left: "50%",
    zIndex: 2,
    position: "absolute",
  },
  statusBar: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: Padding.p_3xs,
    width: 412,
    justifyContent: "space-between",
    height: 52,
    left: 0,
    top: 0,
    position: "absolute",
  },
  frame3: {
    height: 52,
    left: 0,
    top: 0,
    overflow: "hidden",
    width: 424,
    position: "absolute",
  },
  viewWeekIcon: {
    overflow: "hidden",
  },
  viewWeek: {
    width: 37,
    height: 37,
    transform: [
      {
        rotate: "90deg",
      },
    ],
    overflow: "hidden",
    display: "none",
  },
  gridNineIcon: {
    overflow: "hidden",
    display: "none",
  },
  viewWeekParent: {
    width: 127,
    gap: Gap.gap_md,
    overflow: "hidden",
  },
  viewTodayWrapper: {
    width: 40,
    alignItems: "center",
  },
  frameParent: {
    width: 182,
    gap: Gap.gap_md,
  },
  parent: {
    width: 383,
    paddingRight: Padding.p_5xs,
    alignItems: "center",
    height: 88,
  },
  frameInner: {
    left: 1,
    borderBottomRightRadius: Border.br_xs,
    borderBottomLeftRadius: Border.br_xs,
    width: 409,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: 0,
    height: 69,
    top: 0,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  frame4: {
    top: 52,
    left: 7,
    width: 410,
    height: 69,
    overflow: "hidden",
    position: "absolute",
  },
  frame2: {
    top: -5,
    left: -6,
    height: 121,
    overflow: "hidden",
    width: 424,
    position: "absolute",
  },
  image11Icon: {
    height: 104,
    alignSelf: "stretch",
    width: "100%",
  },
  child: {
    alignSelf: "stretch",
    flex: 1,
  },
  frameItem: {
    backgroundColor: Color.color3,
  },
  ii: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.robotoMedium,
  },
  bsjustifyleftIcon: {},
  text1: {
    fontSize: FontSize.size_smi,
    textAlign: "center",
    fontFamily: FontFamily.robotoRegular,
    color: Color.colorBlack,
    letterSpacing: 0,
  },
  bsjustifyleftParent: {
    gap: Gap.gap_sm,
    alignItems: "center",
  },
  frameWrapper: {
    alignItems: "center",
  },
  iiParent: {
    gap: Gap.gap_md,
  },
  text5: {
    fontFamily: FontFamily.robotoMedium,
  },
  frameContainer: {
    alignSelf: "stretch",
  },
  rectangleGroup: {
    alignSelf: "stretch",
    alignItems: "center",
    height: 88,
    flexDirection: "row",
  },
  rectangleView: {
    backgroundColor: Color.color2,
  },
  rectangleContainer: {
    alignSelf: "stretch",
    alignItems: "center",
    height: 88,
    flexDirection: "row",
  },
  view1: {
    width: 390,
    paddingLeft: Padding.p_xl,
    gap: 8,
  },
  image11Parent: {
    height: 785,
    gap: 10,
    top: 0,
  },
  lineIcon: {
    marginTop: 0,
    right: 5,
    borderRadius: 16,
    height: 0,
    maxWidth: "100%",
    overflow: "hidden",
    left: 0,
  },
  circleIcon: {
    marginTop: 4,
    left: 4,
    width: 8,
    height: 8,
  },
  text8: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.colorWhite,
    textAlign: "center",
  },
  number: {
    marginTop: -12,
    right: 0,
    borderRadius: 60,
    backgroundColor: Color.color1,
    padding: Padding.p_5xs,
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    width: 24,
  },
  right1: {
    display: "none",
  },
  right: {
    left: 478,
    width: 76,
    top: 0,
  },
  frame6: {
    top: 466,
    width: 554,
    overflow: "hidden",
    left: 0,
  },
  aioutlinehomeIcon: {},
  text9: {
    color: Color.colorLightgray,
    alignSelf: "stretch",
  },
  text10: {
    color: Color.color,
  },
  navItem1: {
    justifyContent: "center",
  },
  navigationBar5: {
    top: 726,
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Color.colorWhite,
  },
  addButtonIcon: {
    left: 300,
    top: 0,
  },
  frame7: {
    top: 641,
    left: 92,
    width: 370,
    overflow: "hidden",
  },
  frame5: {
    top: 116,
    left: -71,
    height: 801,
    position: "absolute",
  },
  view: {
    height: 917,
    width: "100%",
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
});

export default Frame;