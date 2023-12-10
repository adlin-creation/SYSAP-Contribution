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
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from 'react-native-base64';
import RaccourcisExercice from "../components/progression/RaccourcisExercice.js";

export default class Progression extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            week : 1,
            id : null
        }
    }

    componentDidMount() {
        this.fetchUserId();
    }

    //fonction tres temporaire et ne devrait pas etre utiliser lors du deployement pour raison de securiter
    fetchUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const idRegex = /"id":(\d+)/;
            this.setState({id : parseInt(((base64.decode(token.split('.')[1])).toString()).match(idRegex)[1], 10)});
            console.log(this.state.id);
        } catch (error) {
            console.error('Error finding ID: ', error);
        }
    }

    handleSelect = (selectedItem) => {
        this.setState({week : selectedItem});
    };

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <View style={styles.containerGauche}>
                            <TitreProgression />
                            <BarreProgressionComponent
                                idPatient={this.state.id}
                                week = {this.state.week}
                            />
                        </View>
                        <View style={styles.containerDroite}>
                            <SemaineComponent onSelect={this.handleSelect} idPatient={this.state.id} Programme={"PATH"}/>
                            <ObjectifEtExerciceComponent
                                idPatient={this.state.id}
                                week={this.state.week}
                                iconName={"flag"}
                                section={"Objectif"}
                            />
                            <ObjectifEtExerciceComponent
                                idPatient={this.state.id}
                                week={this.state.week}
                                iconName={"zap"}
                                section={"Séances"}
                            />
                        </View>
                    </View>
                    <StatusBar style="auto" />
                    <BoiteEncadree
                        gauche={
                          <View>
                          <TauxDiffComponent idPatient={this.state.id} week={this.state.week}></TauxDiffComponent>
                        </View>
                        }
                        droite={              
                        <RaccourcisExercice
                          title="Effectuer exercices"
                          onPress={() => this.props.navigation.navigate("Profile")}
                        />
                        }
                    />
                    <BoiteEncadree
                        gauche={
                            <View>
                                <ProgressionMarcheComponent idPatient={this.state.id} week={this.state.week}></ProgressionMarcheComponent>
                            </View>}
                        droite={
                            <View>
                                <Classement idPatient={this.state.id} week={this.state.week}></Classement>
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
