import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import ExerciseService from "../services/ExerciceService";
import ReactPlayer from "react-player";

export default class Seance extends React.Component {
  exercises = [];
  constructor(props) {
    super(props);
    this.state = {
      currentVideoIndex: 0,
      showVideos: false,
      selectedExerciseIndex: null,
      isModalVisible: false,
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
    if (currentVideoIndex === 0) {
      this.setState({ showVideos: false });      
    }

  };

  toggleModal = (index) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      selectedExerciseIndex: index,
    });
  };

  renderExercise = ({ item, index }) => {
    console.log(item);
    return (
      <View key={index}>
        <View>
          <Text style={styles.exComplete}>{item.ExerciseName}</Text>
          <Text>Minimum repetitions: {item.ExerciseNumberRepetitionsMin}</Text>
          <Text>Maximum repetitions: {item.ExerciseNumberRepetitionsMax}</Text>
          <Image
            source={{ uri: `../assets/images_test/${item.ExerciseImageURL}` }}
            style={styles.exerciseImage}
          />
        </View>
        <Text //TODO: faire jouer la video explicative
          style={styles.detailsButton}
          onPress={() => {
            // console.log("Navigating with name:", item.ExerciseName);
            // this.toggleModal(index);
            console.log("Navigating with id:", item.idExercise);
            this.props.navigation.navigate("ExerciseDetail", {
              idExercise: item.idExercise,
              otherParam: "anything you want here",
            });
          }}
        >
          Vidéo explicative de l'exercice
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
                url={`../assets/videos_test/${this.exercises[currentVideoIndex].ExerciseDescriptionURL}`}
                controls={true}
                playing={true}
                onError={(e) => console.error("ReactPlayer error:", e)}
                onEnded={this.playNextVideo}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.jouerButtonSeance}
              onPress={() => this.setState({ showVideos: true })}
            >
              <Text style={styles.jouerButtonText}>Démarrer la séance</Text>
              <Image
                style={styles.playIcon}
                source={require("../assets/icons/playbutton.png")}
              />
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
    padding: 20,
  },
  mainContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  mainTitle: {
    color: "black",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    alignItems: "center",
    marginTop: 40,
    padding: 12,
    borderRadius: 20,
    textDecorationLine: "underline",
  },
  exTitle: {
    color: "black",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 60,
    textDecorationLine: "underline",
  },
  exComplete: {
    margin: "7%",
    fontSize: 24,
    paddingLeft: 60,
    textDecorationLine: "underline",
  },
  exerciseImage: {
    width: 250,
    height: 250,
  },
  detailsButton: {
    backgroundColor: "#9C26B0",
    padding: 30,
    margin: 30,
    alignItems: "center",
    width: 190,
    height: 10,
    marginTop: 20,
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 40,
    color: "white",
    textAlign: "center",
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
    backgroundColor: "#9C26B0",
    padding: 40,
    alignItems: "center",
    width: 400,
    marginTop: 20,
    borderRadius: 5,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  playIcon: {
    width: 70,
    height: 70,
  },
  jouerButtonText: {
    paddingRight: 30,
    color: "white",
    fontSize: 22,
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
