import React from 'react';
import { TouchableHighlight, Text, View, StyleSheet, Alert } from 'react-native';
import Print from 'react-native-print'

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
        Print.print({
            filePath: '../assets/Plan1.pdf', // Remplacez par le chemin de votre document PDF
            isLandscape: false, // Mettez à true si vous souhaitez imprimer en mode paysage
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
