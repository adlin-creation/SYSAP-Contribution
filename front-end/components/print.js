import React from 'react';
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';

const Imprimer = () => {

    // Not implemented
    const fetchPdf = () => {
        // fetch('https://')
    };
    return (
        <View>
            <TouchableHighlight onPress={fetchPdf}>
                <Text >Imprimer</Text>
            </TouchableHighlight>
        </View>
    );
};


export default Imprimer;
