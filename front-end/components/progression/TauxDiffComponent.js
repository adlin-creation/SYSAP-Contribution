import React from "react";
import { View, StyleSheet } from "react-native";

const TauxDiffComponent = ({ difficultyLevels }) => {
  difficultyLevels = difficultyLevels;

  const averageDifficulty =
    difficultyLevels.reduce((a, b) => a + b, 0) / difficultyLevels.length;

  let circleColor;
  if (averageDifficulty <= 1.5) {
    circleColor = "green";
  } else if (averageDifficulty <= 2.5) {
    circleColor = "yellow";
  } else {
    circleColor = "red";
  }

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: circleColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default TauxDiffComponent;
