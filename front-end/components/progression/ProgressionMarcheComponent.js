import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import getFetch from "../apiFetch/getFetch";
import {useIsFocused} from "@react-navigation/native";

const ProgressionMarcheComponent = ({ idPatient, week }) => {
    // creation de variable et setters
    const [totalTimeWalked, setTotalTimeWalked] = useState(0);
    const [nbMarches, setNbMarches] = useState(0);

    //Aller chercher donner dans BD pour lenb marche et duree marche total
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchData = async () => {
            setNbMarches(0);
            setTotalTimeWalked(0);
            try {
                const data = await getFetch(`http://localhost:3000/api/progress/progressionMarche/${idPatient}/${week}`);
                setTotalTimeWalked(data.data.Marche);
                setNbMarches(data.data.NbMarches);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isFocused) {
            fetchData();
        }
    }, [isFocused, week]);


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
              <View style={styles.iconContainer}>
                  <Feather name="clock" size={30} style={styles.icon} />
                  <Feather name="trending-up" size={30} style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                  <Text style={styles.stat}>{formatTime(totalTimeWalked)}</Text>
                  <Text style={[styles.stat, styles.secondStat]}>
                      Nombre de marches: {nbMarches}
                  </Text>
              </View>
          </View>
      </View>
  );
  
};
const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10, 
        textAlign:'center'
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
      flexDirection: "column",
      alignItems: "center",
      marginRight: 15,
    },
    textContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    stat: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F504F',
        marginTop: 10,
    },
    secondStat: {
      marginTop: 16,
    },
    //style pour les icones de nb marches et le petit clock
    icon: {
        color: '#FFA500',
        marginBottom:4
    },
    // Style pour un racourcis de + pour ajouter une marches
    addButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        fontSize: 24,
        color: '#000',
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
    },
});



export default ProgressionMarcheComponent;
