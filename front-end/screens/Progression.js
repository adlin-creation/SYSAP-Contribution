import React from 'react';
import { View, Text } from 'react-native';
import Imprimer from '../components/print.js'

export default class Progression extends React.Component {
    render() {
        return (
            <View>
                <Text>Progression</Text>
                <Imprimer />
            </View>
        );
    }
}
