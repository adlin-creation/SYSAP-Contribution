import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";



//A MODIFIER POUR FAIRE UNE BARRE DEROULANTE
const SemaineComponent = ({ semaine }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.texteSemaine}>Semaine {`${semaine}`} </Text>
      <Feather
        style={styles.icon}
        name="chevron-down"
        size={30}
        color={"white"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "purple",
    paddingLeft: 30,
    paddingRight: 15,
    paddingVertical: 3,
    margin: 10,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  texteSemaine: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 5,
  },
});

export default SemaineComponent;
