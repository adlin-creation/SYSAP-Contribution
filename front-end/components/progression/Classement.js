import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import getFetch from "../apiFetch/getFetch";
import {useIsFocused} from "@react-navigation/native";

const Classement = ({idPatient, week}) => {
    const [ranking, setRanking] = useState('N/A');

    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchData = async () => {
            console.log(week);
            try {
                const response = await getFetch(`http://localhost:3000/api/progress/getAllMarche/${week}`);
                const allMarchesData = response.data;

                const marcheTotals = allMarchesData.reduce((acc, record) => {
                    acc[record.idPatient] = (acc[record.idPatient] || 0) + record.Marche;
                    return acc;
                }, {});

                const sortedTotals = Object.entries(marcheTotals)
                    .map(([id, totalMarche]) => ({ idPatient: parseInt(id), totalMarche }))
                    .sort((a, b) => b.totalMarche - a.totalMarche);

                const classement = sortedTotals.findIndex(item => item.idPatient === idPatient) + 1
                setRanking(classement);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    if (isFocused) fetchData();
    }, [isFocused, week]);

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
