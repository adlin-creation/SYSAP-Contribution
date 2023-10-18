import React from "react";
import { View, Text, ScrollView } from "react-native";
import ExerciseService from "../services/ExerciseService";
import { TouchableOpacity } from "react-native";

export default class ExerciseDetail extends React.Component {
  // state = {
  //   exercise: null,
  //   steps: [],
  // };
  constructor(props) {
    super(props);
    this.state = {
      exercise: null,
      steps: [],
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { exerciseName } = this.props.route.params;
    try {
      const exerciseData = await ExerciseService.fetchExercises();
      // console.log("allo:", exerciseData);
      const exercise = exerciseData.find((e) => e.name === exerciseName);
      if (exercise) {
        this.setState({ exercise });
        console.log(exercise.name);
      } else {
        console.log("Exercice introuvable.");
      }
      //     const stepsData = await ExerciseService.fetchStepsForExercise(exerciseId);
      //     this.setState({ steps: stepsData.steps });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données.",
        error
      );
    }
  }

  render() {
    const { exercise, steps } = this.state;
    if (!exercise) return null;

    return (
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {exercise.name}
        </Text>
        <Text>{exercise.description}</Text>

        {steps.map((step, index) => (
          <View key={index} style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold" }}>{step.step_title}</Text>
            <Text>{step.instruction}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            padding: 10,
            marginTop: 20,
            alignItems: "center",
            width: 100,
          }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Text style={{ color: "white" }}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
