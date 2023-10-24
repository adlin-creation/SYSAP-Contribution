import React from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as Print from 'expo-print';
import {Asset} from "expo-asset";


const Imprimer = () => {

    // Not implemented
    // Fichier dans le projet directement donc aller le chercher
    const fetchPdf = () => {
        Alert.alert(
            "Avertissement",
            "Voulez-vous vraiment imprimer ?",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Annulé"),
                    style: "cancel"
                },
                {
                    text: "Oui", 
                    onPress: () => {
                        console.log("Imprimer");
                    }
                }
            ],
            { cancelable: false }
        );
        printDoc();
    };


    // async function printDocument() {
    //     const pdfUrl = '../assets/Plan1.pdf';
    //     const pdfData = await fetch(pdfUrl).then((response) => response.blob());
    //     await Print.printAsync({ uri: pdfData.uri });
    // }
    const printDoc = async () => {
        const pdfAsset = Asset.fromModule(require('../assets/Plan1.pdf'));
        await pdfAsset.downloadAsync();
        Print.printAsync({
            uri: pdfAsset.localUri,
        });
    }
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.button} underlayColor="lightgray" onPress={fetchPdf}>
                <Text style={styles.buttonText}>Imprimer</Text>
            </TouchableHighlight>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderWidth: 2,
        borderColor: 'blue',
        backgroundColor: 'white',
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
});

export default Imprimer;
