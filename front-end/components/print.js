import React from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as Print from 'expo-print';
import {Asset} from "expo-asset";


const Imprimer = () => {

    const fetchPdf = async () => {
        const pdfAsset = Asset.fromModule(require('../assets/Plan1.pdf'));
        await pdfAsset.downloadAsync();
        await Print.printAsync({
            uri: pdfAsset.localUri,
        });
    };

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
