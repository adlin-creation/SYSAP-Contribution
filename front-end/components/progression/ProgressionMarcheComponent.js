import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressionMarcheComponent = () => {
    // creation de variable et setters
    const [totalTimeWalked, setTotalTimeWalked] = useState(0);
    const [nbMarches, setNbMarches] = useState(0);

    //Aller chercher donner dans BD pour le nb marche et duree marche total
    useEffect(() => {
        const fetchData = async () => {
            const fakeData = {
                totalTime: 120, // Temps total
                marches: 5, // nombre de marche
            };

            setTotalTimeWalked(fakeData.totalTime);
            setNbMarches(fakeData.marches);
        };

        fetchData();
    }, []);


    const formatTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progression de marches</Text>
            <View style={styles.statContainer}>
                <Text style={styles.stat}>Temps total: {formatTime(totalTimeWalked)}</Text>
                <Text style={styles.stat}>Nombre de marches: {nbMarches}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    statContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    stat: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 10,
    },
    //style pour les icones de nb marches et le petit clock
    icon: {
        color: '#FFA500',
        marginRight: 10,
    },
    // Style pour un racourcis de + pour ajouter une marches
    addButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        fontSize: 24,
        color: '#000',
    },
});



export default ProgressionMarcheComponent;
