import React, {useEffect, useState} from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Text, View, StyleSheet } from "react-native";
import {useIsFocused} from "@react-navigation/native";
import getFetch from "../apiFetch/getFetch";

const BarreProgressionComponent = ({ idPatient, week }) => {
  const [completed, setCompleted] = useState(0);
  const [totalTodo, setTotalTodo] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      setCompleted(0);
      setTotalTodo(0);
      try {
        const response = await getFetch(`http://localhost:3000/api/progress/progressionExercices/${idPatient}/${week}`);
        setCompleted(response.data.NbSeances);
        setTotalTodo(response.data.NbObjectifs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (isFocused) fetchData();
  }, [isFocused, idPatient, week]);

  const fillPercentage = completed && totalTodo ? (completed / totalTodo) * 100 : 0;

  return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
              size={150}
              width={15}
              fill={fillPercentage}
              tintColor="#F4902B"
              backgroundColor="#E1DEDB"
              lineCap="round"
          >
            {() => (
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.sessionText}>{`${completed} / ${totalTodo}`}</Text>
                </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  progressContainer: {
    transform: [{ rotate: "-90deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  sessionText: {
    fontSize: 38,
    color: "#615F5F",
    transform: [{ rotate: "90deg" }],
  },
});

export default BarreProgressionComponent;
