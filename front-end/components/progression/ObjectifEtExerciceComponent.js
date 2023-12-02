import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {useIsFocused} from "@react-navigation/native";
import getFetch from "../apiFetch/getFetch";

const ObjectifEtExerciceComponent = ({idPatient, week, section, iconName}) => {
  const [nombre, setNombre] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      setNombre(0);
      try {
        const response = await getFetch(`http://localhost:3000/api/progress/progressionExercices/${idPatient}/${week}`);
        if (section === "Objectif") {
          setNombre(response.data.NbSeances);
        } else {
          setNombre(response.data.NbObjectifs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (isFocused) fetchData();
  }, [isFocused, idPatient, week]);

  return (
    <View style={styles.objectifContainer}>
      <Feather
        name={`${iconName}`}
        size={30}
        color="#000"
        style={styles.icon}
      />
      <View style={styles.texteContainer}>
        <Text style={styles.objectifTexte}>{`${section}`}</Text>
        <Text style={styles.totalSessionTexte}>{nombre}</Text>
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
