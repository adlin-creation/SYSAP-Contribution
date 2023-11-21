import React from 'react';
import { View, Image, Text, StyleSheet , TouchableOpacity, Alert} from 'react-native';
import ajouterMarche from "../apiFetch/postFetch";
import ProgressionMarcheComponent from "./ProgressionMarcheComponent";
const AjouterMarche = () => {

    const handleButtonPress = async () => {
        await ajouterMarche(12);
        Alert.alert('Bouton Pressé');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleButtonPress}>
                <View style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: 'white' }}>Appuyez-moi !</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
export default AjouterMarche;