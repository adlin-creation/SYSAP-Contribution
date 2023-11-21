import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from "react-native-vector-icons/Feather";

const ProgressionMarcheComponent = () => {
    // creation de variable et setters
    const [totalTimeWalked, setTotalTimeWalked] = useState(0);
    const [nbMarches, setNbMarches] = useState(0);

    //Aller chercher donner dans BD pour le nb marche et duree marche total
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/getAllMarche`);
                if (!res.ok){
                    throw new Error(`Erreur HTTP ${res.status}`);
                }
                const data = await res.json();
                let tempsMarche = 0;
                let nbdeMarche = 0;
                data.forEach(item => {
                    tempsMarche += item.Marche;
                    nbdeMarche += item.NbMarches;
                });
                setTotalTimeWalked(tempsMarche);
                setNbMarches(nbdeMarche);
            } catch (error){
               console.error();
            }
        };
        fetchData();
    }, []);


    const formatTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const heures = String(hours).padStart(2, '0');
        const minute = String(minutes).padStart(2, '0');
        return `${heures}:${minute}`;
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progression marche</Text>
            <View style={styles.statContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="clock" size={24} style={styles.icon} />
                    <Text style={styles.stat}>{formatTime(totalTimeWalked)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="trending-up" size={24} style={styles.icon} />
                    <Text style={styles.stat}>Nombre de marches: {nbMarches}</Text>
                </View>
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
        marginTop: -8,
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
