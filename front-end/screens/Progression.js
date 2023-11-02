import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import Imprimer from '../components/imprimer/print.js'
import { StatusBar } from "expo-status-bar";
import SectionHautComponent from "../components/progression/SectionHautComponent";
import BoiteEncadree from "../components/progression/Encadre"


export default class Progression extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Imprimer type={"programme"}/>
                <Text>Progression</Text>
                <SectionHautComponent sessionsCompleted={3} totalSessions={5} />
                <StatusBar style="auto" />
                <BoiteEncadree gauche={<Text>Element gauche</Text>} droite={<Text>Element droite</Text>}/>
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

