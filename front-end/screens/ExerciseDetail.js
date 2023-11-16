import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from "react-native";
import ExerciseService from "../services/ExerciceService";
import ReactPlayer from "react-player";

export default class ExerciseDetail extends React.Component {
  state = {
    exercise: null,
    steps: [],
};




  async componentDidMount() {

    const { idExercise } = this.props.route.params;
    try {
      await this.fetchData(idExercise);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }


  async fetchData(idExercise) {
    try {
      const data = await ExerciseService.fetchExerciseById(idExercise);
      console.log("1");
      console.log(data);
      this.setState({ exercise: data });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données.",
        error
      );
    }
  }


  render() {
    const { exercise, steps } = this.state;

    console.log("3");
    console.log(exercise);

    if (!exercise) return null;

    return (
      <View style={styles.mainContainer}>
          <Text style={styles.exTitle}>{exercise.ExerciseName}</Text>
          <Image
            source={{ uri: `../assets/images_test/${exercise.ExerciseImageURL}` }}
            style={styles.exerciseImage}
          />
          <Text>{exercise.ExerciseDescription}</Text>
          <Text>min : {exercise.ExerciseNumberRepetitionsMin}</Text>
          <Text>max : {exercise.ExerciseNumberRepetitionsMax}</Text>
          <View style={styles.playerContainer}>
              <ReactPlayer
                style={styles.player}
                url={`../assets/videos_test/${exercise.ExerciseExplanationVidURL}`}
                controls={true}
                onError={(e) => console.error("ReactPlayer error:", e)}
              />
            </View>
        <TouchableOpacity
          style={styles.retour}
          onPress={() => this.props.navigation.goBack()}
        >
          <Text style={{ color: "white" }}>Retour</Text>
        </TouchableOpacity>
      </View>
  );
  }
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  mainContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  mainTitle: {
    color: "brown",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  exTitle: {
    color: "black",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
    textDecorationLine:"underline",
  },
  exComplete: {
    margin: "3%",
    fontSize: 26,
  },
  exerciseImage: {
    width: 250,
    height: 250,
  },
  detailsButton: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  playerContainer: {
    marginTop: "3%",
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "3%",
  },
  player: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  jouerButtonSeance: {
    backgroundColor: "green",
    padding: 40,
    alignItems: "center",
    width: 400,
    marginTop: 20,
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 30,
    borderBottomWidth: 30,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
  },
  jouerButtonText: {
    paddingRight: 30,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  retour: {
    backgroundColor: "#9C26B0",
    padding: 20,
    margin: 30,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 200,
    color: "white",
  },
});
