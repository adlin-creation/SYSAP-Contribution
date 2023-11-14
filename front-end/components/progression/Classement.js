import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Classement = () => {
    const [ranking, setRanking] = useState('N/A');

    useEffect(() => {
        const fetchedRanking = '3'; //aller chercher le vrai rankings ici
        setRanking(fetchedRanking);
        return () => {
        };
    }, []);

    return (
        <View>
            <Image
                source={require('../../assets/images/trophy.png')}
                style={styles.image}
            />
            <Text style={styles.rankingText}>Classement: {ranking}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    rankingText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Classement;
