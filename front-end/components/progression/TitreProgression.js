import React from "react";
import { Text, View, StyleSheet } from "react-native";

const TitreProgression = () => {
  return (
    <View style={styles.titreProgContainer}>
      <Text style={styles.texteProgression}>Progression</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titreProgContainer: {
    backgroundColor: "purple", //bleu
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  texteProgression: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default TitreProgression;
