import React from 'react';
import { View, StyleSheet } from 'react-native';

const BoiteEncadree = ({gauche, droite}) => {
    return (
        <View style={styles.container}>
            <View style={styles.containerGauche}>
                {gauche}
            </View>
            <View style={styles.containerDroite}>
                {droite}
            </View>
        </View>
    );
};

const baseContainerStyle = {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    margin: 10,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'flex-start',
    },
    containerGauche: {
        ...baseContainerStyle,
    },
    containerDroite: {
        ...baseContainerStyle,
    },
});

export default BoiteEncadree;
