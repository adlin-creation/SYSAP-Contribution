import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Imprimer from "../components/imprimer/print.js";
import { StatusBar } from "expo-status-bar";
import SectionHautComponent from "../components/progression/SectionHautComponent";
import BoiteEncadree from "../components/progression/Encadre";
import TauxDiffComponent from "../components/progression/TauxDiffComponent.js";
import ProgressionMarcheComponent from "../components/progression/ProgressionMarcheComponent";

export default class Progression extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Imprimer type={"programme"} />
        <SectionHautComponent sessionsCompleted={3} totalSessions={5} />
        <StatusBar style="auto" />
        <BoiteEncadree
          gauche={
            <View>
              <Text>Difficulté moyenne</Text>
              <TauxDiffComponent difficultyLevels={[2]}></TauxDiffComponent>
            </View>
          }
          droite={<Text>Element droite</Text>}
        />
          <BoiteEncadree
              gauche={
              <View>
                  <ProgressionMarcheComponent></ProgressionMarcheComponent>
              </View>}
              droite={
              <Text>Tropher ici avec le ranking des autres vieille croute</Text>}
              />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
