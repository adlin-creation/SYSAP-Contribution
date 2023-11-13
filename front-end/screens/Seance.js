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
// import Video from 'react-native-video';

export default class Seance extends React.Component {
  exercises = [];
  constructor(props) {
    super(props);
    this.state = {
      currentVideoIndex: 0,
      showVideos: false,
    };
  }

  async componentDidMount() {
    try {
      await this.fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    this.playNextVideo();
  }

  async fetchData() {
    try {
      const data = await ExerciseService.fetchExercises();
      console.log(data);
      this.exercises = data;
      console.log(this.exercises);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données.",
        error
      );
    }
  }

  playNextVideo = () => {
    const { currentVideoIndex } = this.state;
    const nextIndex = (currentVideoIndex + 1) % this.exercises.length;
    this.setState({ currentVideoIndex: nextIndex });
  };



  renderExercise = ({ item, index }) => {
    console.log(item);
    return (
      <View key={index}>
        <View>
          <Text style={styles.exComplete}>{item.ExerciseName}</Text>
          <Text>Minimum repetitions: {item.ExerciseNumberRepetitionsMin}</Text>
          <Text>Maximum repetitions: {item.ExerciseNumberRepetitionsMax}</Text>
          <Text>Chemin video: {item.ExerciseDescriptionURL}</Text>
          {/* <Image source={{ uri: item.image }} style={styles.exerciseImage} /> */}
        </View>
        <Text
          style={styles.detailsButton}
          onPress={() => {
            console.log("Navigating with name:", item.nom);
            this.props.navigation.navigate("ExerciseDetail", {
              exerciseName: item.nom,
            });
          }}
        >
          Détails
        </Text>
      </View>
    );
  };

  render() {
    const { currentVideoIndex, showVideos } = this.state;
    return (
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.mainTitle}>Ma Séance</Text>
          {showVideos ? (
            <View style={styles.playerContainer}>
              <ReactPlayer
                style={styles.player}
                // url={require(this.exercises[currentVideoIndex]?.ExerciseDescriptionURL)}
                // url={require(`../assets/videos_test/${this.exercises[currentVideoIndex]?.ExerciseDescriptionURL}`)}
                url={`../assets/videos_test/${this.exercises[currentVideoIndex].ExerciseDescriptionURL}`}
                controls={true}
                onError={(e) => console.error("ReactPlayer error:", e)}
                onEnded={this.playNextVideo}Z
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.jouerButtonSeance}
              onPress={() => this.setState({ showVideos: true })}
            >
              <Text style={styles.jouerButtonText}>Démarrer La Séance</Text>
              <View style={styles.playTriangle} />
            </TouchableOpacity>
          )}
          <View style={styles.exComplete}>
            <Text style={styles.exTitle}>
              Exercices à compléter aujourd'hui
            </Text>
          </View>
          <View>
            {this.exercises.map((item, index) =>
              this.renderExercise({ item, index })
            )}
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
    color: "brown",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  exTitle: {
    color: "red",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
  },
  exComplete: {
    margin: "3%",
    fontSize: 26,
  },
  exerciseImage: {
    width: 100,
    height: 100,
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
    backgroundColor: "blue",
    padding: 10,
    margin: 20,
    alignItems: "center",
    width: 100,
  },
});
