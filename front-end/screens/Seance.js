import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import ExerciseService from "../services/ExerciceService";
import { Video, ResizeMode } from "expo-av";

const assetsFolderRoot = process.env.ASSETS_FOLDER_ROOT;

const Seance = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exerciseSelection, setExerciseSelection] = useState([]);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ExerciseService.fetchExercises();
        setExercises(data);
        setExerciseSelection(Array(data.length).fill(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showVideos) {
      playNextVideo();
    }
  }, [showVideos]);

  const playNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % exercises.length);
    if (currentVideoIndex === 0) {
      setShowVideos(false);
    }
  };

  const toggleModal = (index) => {
    setIsModalVisible(!isModalVisible);
    setSelectedExerciseIndex(index);
  };

  const toggleExerciseSelection = (index) => {
    const updatedSelection = [...exerciseSelection];
    updatedSelection[index] = !updatedSelection[index];
    setExerciseSelection(updatedSelection);
  };

  const renderExercise = ({ item, index }) => (
    <View key={index}>
      <View style={styles.exerciseContainer}>
        <Text style={styles.exComplete}>{item.ExerciseName}</Text>
        <Image
          source={{
            uri: `${assetsFolderRoot}/assets/images/${item.ExerciseImageURL}`,
          }}
          style={styles.exerciseImage}
        />
        <Text>Minimum repetitions: {item.ExerciseNumberRepetitionsMin}</Text>
        <Text>Maximum repetitions: {item.ExerciseNumberRepetitionsMax}</Text>
        <Text
          style={styles.detailsButton}
          onPress={() =>
            navigation.navigate("ExerciseDetail", {
              idExercise: item.idExercise,
              otherParam: "anything you want here",
            })
          }
        >
          Vidéo explicative
        </Text>
        <Switch
          value={exerciseSelection[index]}
          onValueChange={() => toggleExerciseSelection(index)}
          style={styles.checkbox}
        />
        <Text>Compléter</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <Text style={styles.mainTitle}>Ma Séance</Text>
        {showVideos ? (
          <View style={styles.playerContainer}>
            <Video
              ref={video}
              style={styles.player}
              source={{
                uri: `${assetsFolderRoot}assets/videos/${exercises[currentVideoIndex]?.ExerciseDescriptionURL}`,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              onError={(e) => console.error("Video error:", e)}
              onEnded={playNextVideo}
            />
            {/* <ReactPlayer
              style={styles.player}
              url={`${assetsFolderRoot}assets/videos/${exercises[currentVideoIndex]?.ExerciseDescriptionURL}`}
              controls={true}
              playing={true}
              onError={(e) => console.error("ReactPlayer error:", e)}
              onEnded={playNextVideo}
            /> */}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.jouerButtonSeance}
            onPress={() => setShowVideos(true)}
          >
            <Text style={styles.jouerButtonText}>Démarrer la séance</Text>
            <Image
              style={styles.playIcon}
              source={require("../assets/icons/playbutton.png")}
            />
          </TouchableOpacity>
        )}
        <View style={styles.exComplete}>
          <Text style={styles.exTitle}>Exercices à compléter aujourd'hui</Text>
        </View>
        <View>
          {exercises.map((item, index) => renderExercise({ item, index }))}
        </View>
        <TouchableOpacity
          style={styles.retour}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "white" }}>Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
  },
  exComplete: {
    color: "#9C26B0",
    margin: "6%",
    fontSize: 24,
    paddingLeft: 60,
    textDecorationLine: "underline",
  },
  checkbox: {
    alignSelf: "center",
    margin: 20,
  },
  exerciseImage: {
    width: 250,
    height: 250,
    margin: 30,
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

export default Seance;
