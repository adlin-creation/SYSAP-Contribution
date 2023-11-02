import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

const ObjectifEtExerciceComponent = ({
  totalSessions,
  iconName,
  nomSection,
}) => {
  return (
    <View style={styles.objectifContainer}>
      <Feather
        name={`${iconName}`}
        size={30}
        color="#000"
        style={styles.icon}
      />
      <View style={styles.texteContainer}>
        <Text style={styles.objectifTexte}>{`${nomSection}`}</Text>
        <Text style={styles.totalSessionTexte}>{`${totalSessions}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  objectifContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  texteContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  totalSessionTexte: {
    fontWeight: "bold",
    fontSize: 20,
  },
  icon: {
    marginRight: 15,
  },
  objectifTexte: {
    fontSize: 20,
  },
});

export default ObjectifEtExerciceComponent;
