import React from "react";
import { Text, Block, Radio, Button } from "galio-framework";
import { useState, useReducer } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

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
    case "DecrementerTempsDeMarche": {
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
    {
      nom: "Très satisfait",
      icone: <Entypo name="emoji-flirt" size={24} color="#3740ff" />,
    },
    {
      nom: "Satisfait",
      icone: <Entypo name="emoji-happy" size={24} color="#3740ff" />,
    },
    {
      nom: "Neutre",
      icone: <Entypo name="emoji-neutral" size={24} color="#3740ff" />,
    },
    {
      nom: "insatisfait",
      icone: <Entypo name="emoji-sad" size={24} color="#3740ff" />,
    },
    {
      nom: "Très insatisfait",
      icone: <FontAwesome5 name="angry" size={24} color="#3740ff" />,
    },
  ];
  const douleurOptions = [
    "Aucune",
    "Légère",
    "Modérée",
    "Sévère",
    "Très sévère",
  ];
  const motivationOptions = ["Bonne", "Mauvaise"];
  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <Block center>
      {/* Selection du niveau de satisfaction */}
      {step === 0 && (
        <Block center>
          <Text h6>Êtes-vous satisfait de l'exercice ?</Text>
          <Block left>
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
                <Block row middle>
                  <View key={index} style={styles.radioCircle}>
                    {valeurs.satisfaction === index && (
                      <View style={styles.selectedRb} />
                    )}
                  </View>
                  <View style={styles.icones}>{option.icone}</View>
                  <Text>{option.nom}</Text>
                </Block>
              </TouchableOpacity>
            ))}
          </Block>
          <Button disabled={valeurs.satisfaction === ""} onPress={nextStep}>Suivant</Button>
        </Block>
      )}
      {/* Selection du niveau de douleur */}
      {/* <Text h5>Douleur</Text>
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
      </Block> */}
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
  icones: {
    margin: 5,
  },
});
