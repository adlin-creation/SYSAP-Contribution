import React from "react";
import { View, StyleSheet, Text } from "react-native";

const TauxDiffComponent = ({ difficultyLevels }) => {
  difficultyLevels = difficultyLevels;

  const averageDifficulty =
    difficultyLevels.reduce((a, b) => a + b, 0) / difficultyLevels.length;

  let circleColor;
  if (averageDifficulty <= 1.5) {
    borderCircleColor = "#006400";
    circleColor = "green";
  } else if (averageDifficulty <= 2.5) {
    borderCircleColor = "#E2E200";
    circleColor = "yellow";
  } else {
    borderCircleColor = "#CC0000";
    circleColor = "red";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Difficulté moyenne</Text>
      <View style={[styles.circle, 
        { 
          borderColor: borderCircleColor, 
          borderWidth:3, 
          backgroundColor: circleColor 
          }
          ]} 
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding:8
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: 10,
  },
  text:{
    fontSize:14,
    fontWeight:'bold'
  }
});

export default TauxDiffComponent;
