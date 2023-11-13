import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as Print from 'expo-print';
import {Asset} from "expo-asset";

const Imprimer = ({type}) => {
    const display =
        type === 'programme' ? 'Imprimer' : type === 'carnet' ? 'Évaluation' : 'Autres';

    let document = "Bleu1";
    let pdfPath = `../../assets/imprimer/${document}.pdf`
    const fetchPdf = async () => {
        try {
            const pdfAsset = Asset.fromModule(require(pdfPath));
            await pdfAsset.downloadAsync();
            await Print.printAsync({
                uri: pdfAsset.localUri,
            });
        } catch (e) {
            console.log('Error while printing:', e);
        }
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
        justifyContent: 'center',
        alignItems: 'center',
        margin:10,
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
