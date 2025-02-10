import React from 'react';
import { View, StyleSheet } from 'react-native';

const BoiteEncadree = ({ gauche, droite }) => {
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
    borderWidth: 0, // removed border
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
