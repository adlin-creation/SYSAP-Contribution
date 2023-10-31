import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as Print from 'expo-print';
import {Asset} from "expo-asset";


const Imprimer = ({type}) => {

    let display;
    if (type === "programme") {
        display = "Imprimer";
    } else if (type === "carnet") {
        display = "Évaluation";
    } else {
        display = "Autres"
    }

    const fetchPdf = async () => {
        let impression = "Plan2";
        const pdfAsset = Asset.fromModule(require(`../assets/${impression}.pdf`));
        await pdfAsset.downloadAsync();
        await Print.printAsync({
            uri: pdfAsset.localUri,
        });
    };

    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.button} underlayColor="lightgray" onPress={fetchPdf}>
                <Text style={styles.buttonText}>{display}</Text>
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
        borderColor: 'purple',
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
