import React , { useEffect, useState }from "react";
import { StyleSheet, Text, View, Button , ScrollView} from "react-native";
import Imprimer from "../components/imprimer/print.js";
import { StatusBar } from "expo-status-bar";
import BoiteEncadree from "../components/progression/Encadre";
import TauxDiffComponent from "../components/progression/TauxDiffComponent.js";
import ProgressionMarcheComponent from "../components/progression/ProgressionMarcheComponent";
import Classement from "../components/progression/Classement";
import AjouterMarche from "../components/progression/AjouterMarche";
import TitreProgression from "../components/progression/TitreProgression";
import BarreProgressionComponent from "../components/progression/BarreProgressionComponent";
import SemaineComponent from "../components/progression/SemaineComponent";
import ObjectifEtExerciceComponent from "../components/progression/ObjectifEtExerciceComponent";

const sessionsCompleted = 2;
const totalSessions = 6;

export default class Progression extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            week : 1
        }
    }


    handleSelect = (selectedItem, index) => {
        this.setState({week : index + 1});
    };

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Imprimer type={"programme"} />
                    {<AjouterMarche/>}
                    <View style={styles.container2}>
                        <View style={styles.containerGauche}>
                            <TitreProgression />
                            <BarreProgressionComponent
                                idPatient={1}
                                week = {this.state.week}
                            />
                        </View>
                        <View style={styles.containerDroite}>
                            <SemaineComponent onSelect={this.handleSelect}/>
                            <ObjectifEtExerciceComponent
                                totalSessions={totalSessions}
                                iconName={"zap"}
                                nomSection={"Objectif"}
                            />
                            <ObjectifEtExerciceComponent
                                totalSessions={sessionsCompleted}
                                iconName={"flag"}
                                nomSection={"Séances"}
                            />
                        </View>
                    </View>
                    {/*<SectionHautComponent sessionsCompleted={3} totalSessions={5} />*/}
                    <StatusBar style="auto" />
                    <BoiteEncadree
                        gauche={
                            <View>
                                <Text>Difficulté moyenne</Text>
                                <TauxDiffComponent difficultyLevels={[2]}></TauxDiffComponent>
                            </View>
                        }
                        droite={<Button title="Effectuer Exercices" onPress={() => this.props.navigation.navigate('Profile')} />}
                    />
                    <BoiteEncadree
                        gauche={
                            <View>
                                <ProgressionMarcheComponent idPatient={1} week={this.state.week}></ProgressionMarcheComponent>
                            </View>}
                        droite={
                            <View>
                                <Classement idPatient={1} week={this.state.week}></Classement>
                            </View>}
                    />
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    container2: {
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
        flex: 1,
        alignItems: "center",
    },
});
