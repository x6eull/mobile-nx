import * as React from "react";
import { StyleSheet, View } from "react-native";

const Rectangle = () => {
  return <View style={styles.rectangleView} />;
};

const styles = StyleSheet.create({
  rectangleView: {
    backgroundColor: "#279dae",
    flex: 1,
    width: "100%",
    height: 88,
    opacity: 0.6,
  },
});

export default Rectangle;