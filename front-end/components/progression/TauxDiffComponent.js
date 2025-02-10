import React, {useEffect, useState} from "react";
import { View, StyleSheet, Text } from "react-native";
import {useIsFocused} from "@react-navigation/native";
import getFetch from "../apiFetch/getFetch";

const TauxDiffComponent = ({ idPatient, week }) => {
  let [difficultyLevels, setDifficulty] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await getFetch(`http://localhost:3000/api/progress/progressionExercices/${idPatient}/${week}`);
        setDifficulty(res.data.DiffMoyenne);
      } catch (error) {
        console.error("Donnees non trouvee : " + error);
      }
    };
    if (isFocused) fetchData();
  }, [isFocused, week]);


  let circleColor;
  let borderCircleColor;
  if (difficultyLevels <= 1.5) {
    borderCircleColor = "#006400";
    circleColor = "green";
  } else if (difficultyLevels <= 2.5) {
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
