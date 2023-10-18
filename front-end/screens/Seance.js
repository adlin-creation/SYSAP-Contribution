import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import ExerciseService from "../services/ExerciseService";
import ReactPlayer from "react-player";

export default class Seance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const data = await ExerciseService.fetchExercises();
      this.setState({ exercises: data });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données.",
        error
      );
    }
  }

  renderExerciseList = ({ item }) => {
    return (
      <view>
        <Text style={styles.exercices}>{item.name}</Text>
      </view>
    );
  };

  renderExercise = ({ item }) => {
    return (
      <view>
        <TouchableOpacity
          style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
          onPress={() => {
            console.log("Navigating with name:", item.name);
            this.props.navigation.navigate("ExerciseDetail", {
              exerciseName: item.name,
              otherParam: "anything you want here",
            });
          }}
        >
          <Text style={styles.exercices}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Image
            source={{ uri: item.image }}
            style={{ width: 200, height: 200 }}
          />
        </TouchableOpacity>
      </view>
    );
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.mainTitle}>Ma Séance</Text>

          <View style={styles.playerContainer}>
            {/* fonctionne juste sur web (bug sur ios) */}
            <ReactPlayer
              style={styles.player}
              //eventuellement fetch de la bd
              url="https://youtu.be/dQw4w9WgXcQ?si=ca1IKvP_pVCkckVi"
              controls={true}
              onError={(e) => console.error("ReactPlayer error:", e)}
            />
          </View>
          <View style={styles.exComplete}>
            {/* faire une liste dynamic avec checkbox.. */}
            <Text style={styles.exTitle}>Exerices à compléter aujourd'hui</Text>
            {this.state.exercises.map((exercise, index) => (
              <Text key={index}>
                {exercise.name} - {exercise.description}
              </Text>
            ))}
          </View>
          <View>
            <FlatList
              data={this.state.exercises}
              renderItem={this.renderExercise}
            />
          </View>
          <TouchableOpacity
            style={styles.retour}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={{ color: "white" }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  exTitle: {
    color: "green",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
  },
  exComplete: {
    margin: "3%",
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
  exercices: {
    fontSize: 18,
    fontWeight: "bold",
  },
  retour: {
    backgroundColor: "blue",
    padding: 10,
    margin: 20,
    alignItems: "center",
    width: 100,
  },
});