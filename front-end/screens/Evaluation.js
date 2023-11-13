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
      return { ...state, tempsDeMarche: state.tempsDeMarche + action.value };
    case "DecrementerTempsDeMarche": {
      if (state.tempsDeMarche - action.value > 0) {
        return { ...state, tempsDeMarche: state.tempsDeMarche - action.value };
      } else {
        return { ...state, tempsDeMarche: 0 };
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
  let nbExos = 0;
  if (nbExercices) {
    nbExos = nbExercices;
  }
  const [valeurs, dispatchValeurs] = useReducer(reducer, {
    satisfaction: "",
    douleur: "",
    motivation: "",
    tempsDeMarche: 0,
    nbExercices: nbExos,
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
    { name: "Intense", color: "#ff0000" },
    { name: "Modérée", color: "#ff8000" },
    { name: "Légère", color: "#ffff00" },
    { name: "Aucune", color: "#00ff00" },
  ];
  const motivationOptions = [
    {
      name: "Bonne",
      icone: <Entypo name="thumbs-up" size={50} color="#3740ff" />,
    },
    {
      name: "Mauvaise",
      icone: <Entypo name="thumbs-down" size={50} color="#3740ff" />,
    },
  ];
  const nextStep = () => {
    setStep(step + 1);
  };
  const previousStep = () => {
    setStep(step - 1);
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
          <Button disabled={valeurs.satisfaction === ""} onPress={nextStep}>
            Suivant
          </Button>
        </Block>
      )}
      {/* Selection du niveau de douleur */}
      {step === 1 && (
        <Block center>
          <Text h6>Quel est votre niveau de douleur ?</Text>
          <Block left>
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
                  <View
                    style={{
                      backgroundColor: option.color,
                      width: 40,
                      height: 20,
                      marginRight: 10,
                    }}
                  ></View>
                  <Text>{option.name}</Text>
                </Block>
              </TouchableOpacity>
            ))}
          </Block>
          <Block row>
            <Button onPress={previousStep}>Précédent</Button>
            <Button disabled={valeurs.douleur === ""} onPress={nextStep}>
              Suivant
            </Button>
          </Block>
        </Block>
      )}
      {/* Selection de la motivation */}
      {step === 2 && (
        <Block center space="between">
          <Text h6>Quel est votre niveau de motivation ?</Text>
          <Block row>
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
                <Block column center>
                  <View style={styles.icones}>{option.icone}</View>
                  <Text>{option.name}</Text>
                  <View key={index} style={styles.radioCircle}>
                    {valeurs.motivation === index && (
                      <View style={styles.selectedRb} />
                    )}
                  </View>
                </Block>
              </TouchableOpacity>
            ))}
          </Block>
          <Block row>
            <Button onPress={previousStep}>Précédent</Button>
            <Button disabled={valeurs.motivation === ""} onPress={nextStep}>
              Suivant
            </Button>
          </Block>
        </Block>
      )}
      {/* Selection du temps de marche avec des boutons pour incrementer par 1, par 5 et par 10 au-dessus et decrementer par les memes steps en dessous */}
      {step === 3 && (
        <Block center>
          <Text h6>Combien de temps avez-vous marché ?</Text>
          <Block row fluid>
            {[1, 5, 10].map((value) => (
              <Button
                size="small"
                onPress={() =>
                  dispatchValeurs({
                    type: "IncrementerTempsDeMarche",
                    value: value,
                  })
                }
              >
                <Text color="#FFFFFF">+{value}</Text>
              </Button>
            ))}
          </Block>
          <Text>{valeurs.tempsDeMarche} minutes</Text>
          <Block row fluid>
            {[1, 5, 10].map((value) => (
              <Button
                size="small"
                onPress={() =>
                  dispatchValeurs({
                    type: "DecrementerTempsDeMarche",
                    value: value,
                  })
                }
              >
                <Text color="#FFFFFF">-{value}</Text>
              </Button>
            ))}
          </Block>
          <Block row>
            <Button onPress={previousStep}>Précédent</Button>
            <Button onPress={nextStep}>Suivant</Button>
          </Block>
        </Block>
      )}
      {/* Résumé des données saisies */}
      {step === 4 && (
        <Block center flex space="around">
          <Text h4>Bilan</Text>
          <Block left>
            <Block row middle>
              <Text h6 bold>
                Satisfaction :{" "}
              </Text>
              {satisfactionOptions[valeurs.satisfaction].icone}
              <Text color="#3740ff" size={20}>
                {"  " + satisfactionOptions[valeurs.satisfaction].nom}
              </Text>
            </Block>
            <Block row middle>
              <Text h6 bold>
                Douleur :{" "}
              </Text>
              <View
                style={{
                  backgroundColor:
                    douleurOptions[valeurs.douleur].color || "#00ff00",
                  width: 40,
                  height: 20,
                  marginRight: 10,
                }}
              ></View>
              <Text color="#3740ff" size={20}>
                {douleurOptions[valeurs.douleur].name}
              </Text>
            </Block>
            <Block row middle>
              <Text h6 bold>
                Motivation :{" "}
              </Text>
              {motivationOptions[valeurs.motivation].icone}
            </Block>
            <Block row middle>
              <Text h6 bold>Temps de marche : </Text>
              <Text size={20} color="#3740ff">
                {valeurs.tempsDeMarche} minutes
              </Text>
            </Block>
            <Block row middle>
              <Text h6 bold>Nombre d'exercices : </Text>
              <Text size={20} color="#3740ff">
                {valeurs.nbExercices} exercices
              </Text>
            </Block>
          </Block>
          <Block row>
            <Button onPress={previousStep}>Précédent</Button>
            <Button onPress={nextStep}>Suivant</Button>
          </Block>
        </Block>
      )}
      {/* Fin de l'évaluation, Message d'encouragement, bouton precedent et envoie du formulaire */}
      {step === 5 && (
        <Block center>
          <Text h4>Merci pour votre participation !</Text>
          <Text h5>Continuez comme ça !</Text>
          <Block row>
            <Button onPress={previousStep}>Précédent</Button>
            <Button onPress={() => {}}>Envoyer</Button>
          </Block>
        </Block>
      )}
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
