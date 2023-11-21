import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet , TouchableOpacity, Alert} from 'react-native';
import getFetch from "../apiFetch/getFetch";
import postFetch from "../apiFetch/postFetch";
import ajouterMarche from "../apiFetch/postFetch";

const AjouterMarche = () => {
    const [message, setMessage] = useState('');

    const handleButtonPress = async () => {
        setMessage('Action exécutée !');
        await ajouterMarche(12);
        // Ajoutez ici le code que vous souhaitez exécuter lorsque le bouton est pressé
        // Par exemple, vous pouvez afficher une boîte de dialogue (Alert)
        // ou effectuer une autre action.
        Alert.alert('Bouton Pressé');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleButtonPress}>
                <View style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: 'white' }}>Appuyez-moi !</Text>
                </View>
            </TouchableOpacity>

            <Text style={{ marginTop: 20 }}>{message}</Text>
        </View>
    );
}
export default AjouterMarche;