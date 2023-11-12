import React from "react";
import { Text, Block, Radio, Button } from "galio-framework";
import { useState, useReducer } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

function reducer(state, action) {
  switch (action.type) {
    case "satisfaction":
      return {
        ...state,
        satisfaction: action.satisfaction === action.value ? "" : action.value,
      };
    case "douleur":
      return {
        ...state,
        douleur: action.douleur === action.value ? "" : action.value,
      };
    case "motivation":
      return {
        ...state,
        motivation: action.motivation === action.value ? "" : action.value,
      };
    case "IncrementerTempsDeMarche":
      return { ...state, tempsDeMarche: state.tempsDeMarche + 1 };
    case "DecrementerTempsDeMarche":
      {
        if (state.tempsDeMarche > 0) {
          return { ...state, tempsDeMarche: state.tempsDeMarche - 1 };
        }
      }
    case "nbExercices":
      return { ...state, nbExercices: action.value };
    default:
      throw new Error();
  }
}

export default function Evaluation(props) {
  const [step, setStep] = useState(0);
  const { nbExercices } = props;
  const [valeurs, dispatchValeurs] = useReducer(reducer, {
    satisfaction: "",
    douleur: "",
    motivation: "",
    tempsDeMarche: 0,
    nbExercices: nbExercices,
  });
  const satisfactionOptions = [
    "Très satisfait",
    "Satisfait",
    "Neutre",
    "insatisfait",
    "Très insatisfait",
  ];
  const douleurOptions = [
    "Aucune",
    "Légère",
    "Modérée",
    "Sévère",
    "Très sévère",
  ];
  const motivationOptions = ["Bonne", "Mauvaise"];

  return (
    <Block center>
      <Text h5>Statisfaction</Text>
      <Block>
        {satisfactionOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() =>
              dispatchValeurs({
                type: "satisfaction",
                satisfaction: valeurs.satisfaction,
                value: index,
              })
            }
          >
            <Block row>
              <View key={index} style={styles.radioCircle}>
                {valeurs.satisfaction === index && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text>{option}</Text>
            </Block>
          </TouchableOpacity>
        ))}
      </Block>
      <Text h5>Douleur</Text>
      <Block>
        {douleurOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() =>
              dispatchValeurs({
                type: "douleur",
                douleur: valeurs.douleur,
                value: index,
              })
            }
          >
            <Block row>
              <View key={index} style={styles.radioCircle}>
                {valeurs.douleur === index && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text>{option}</Text>
            </Block>
          </TouchableOpacity>
        ))}
      </Block>
      <Text h5>Motivation</Text>
      <Block>
        {motivationOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() =>
              dispatchValeurs({
                type: "motivation",
                motivation: valeurs.motivation,
                value: index,
              })
            }
          >
            <Block row>
              <View key={index} style={styles.radioCircle}>
                {valeurs.motivation === index && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text>{option}</Text>
            </Block>
          </TouchableOpacity>
        ))}
      </Block>
      <Text h5>Temps de marche</Text>
      <Block>
        <Text>{valeurs.tempsDeMarche} minutes</Text>
        <Block row>
          <Button
            onPress={() =>
              dispatchValeurs({
                type: "DecrementerTempsDeMarche",
                value: 1,
              })
            }
          >
            <Entypo name="minus" size={24} color="black" />
          </Button>
          <Button
            onPress={() =>
              dispatchValeurs({
                type: "IncrementerTempsDeMarche",
                value: 1,
              })
            }
          >
            <Entypo name="plus" size={24} color="black" />
          </Button>
        </Block>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#3740ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#3740ff",
  },

  option: {
    margin: 10,
  },
});
