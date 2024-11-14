import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import ExerciseService from "../services/ExerciceService";
import { Video, ResizeMode } from "expo-av";

const assetsFolderRoot = process.env.ASSETS_FOLDER_ROOT;

const ExerciseDetail = ({ route, navigation }) => {
  const [exercise, setExercise] = useState(null);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const { idExercise } = route.params;
    const fetchData = async (id) => {
      try {
        const data = await ExerciseService.fetchExerciseById(id);
        setExercise(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(idExercise);
  }, [route.params]);

  if (!exercise) return null;

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.exTitle}>{exercise.ExerciseName}</Text>
      <Image
        source={{
          uri: `${assetsFolderRoot}assets/images/${exercise.ExerciseImageURL}`,
        }}
        style={styles.exerciseImage}
      />
      <Text>{exercise.ExerciseDescription}</Text>
      <Text>min : {exercise.ExerciseNumberRepetitionsMin}</Text>
      <Text>max : {exercise.ExerciseNumberRepetitionsMax}</Text>
      <View style={styles.playerContainer}>
        {/* <ReactPlayer
          style={styles.player}
          url={`${assetsFolderRoot}assets/videos/${exercise.ExerciseDescriptionURL}`}
          controls={true}
          onError={(e) => console.error("ReactPlayer error:", e)}
        /> */}
        <Video
          ref={video}
          style={styles.player}
          source={{
            uri: `${assetsFolderRoot}assets/videos/${exercise.ExerciseDescriptionURL}`,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onError={(e) => console.error("Video error:", e)}
        />
      </View>
      <TouchableOpacity
        style={styles.retour}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "white" }}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    textDecorationLine: "underline",
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

export default ExerciseDetail;
