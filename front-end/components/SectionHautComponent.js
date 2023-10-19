import React from "react";
import { View, StyleSheet, Text } from "react-native";
import BarreProgressionComponent from "./BarreProgressionComponent";
import TitreProgression from "./TitreProgression";
import SemaineComponent from "./SemaineComponent";
import ObjectifEtExerciceComponent from "./ObjectifEtExerciceComponent";

const SectionHautComponent = ({ sessionsCompleted, totalSessions }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerGauche}>
        <TitreProgression />
        <BarreProgressionComponent
          sessionsCompleted={sessionsCompleted}
          totalSessions={totalSessions}
        />
      </View>
      <View style={styles.containerDroite}>
        <SemaineComponent semaine={1} />
        <ObjectifEtExerciceComponent
          totalSessions={totalSessions}
          iconName={"zap"}
          nomSection={"Objectif"}
        />
        <ObjectifEtExerciceComponent
          totalSessions={sessionsCompleted}
          iconName={"flag"}
          nomSection={"Exercices"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  containerGauche: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
    alignItems: "center",
  },
  containerDroite: {
    flexDirection: "column",
    alignItems: "flex-end",
    flex: 1,
    alignItems: "center",
  },
});

export default SectionHautComponent;
