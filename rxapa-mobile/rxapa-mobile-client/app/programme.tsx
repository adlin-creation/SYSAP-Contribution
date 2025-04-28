// objective: Create a ProgrammeScreen component that displays the user's name, program name, current day, and buttons to increment and decrement the current day.
// objective: Créer un composant ProgrammeScreen qui affiche le nom de l'utilisateur, le nom du programme, le jour actuel et des boutons pour incrémenter et décrémenter le jour actuel.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const { t, i18n } = useTranslation();

export default function ProgrammeScreen() {
  const [fullName, setFullName] = useState('');
  const [programName, setProgramName] = useState('');
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const fullName = await AsyncStorage.getItem('fullName');
      const programName = await AsyncStorage.getItem('programName');
      const currentDay = await AsyncStorage.getItem('currentDay');
      setFullName(fullName || '');
      setProgramName(programName || '');
      setCurrentDay(parseInt(currentDay || '0', 10));
    };
    fetchData();
  }, []);

  const incrementDay = () => {
    setCurrentDay((prevDay) => {
      const newDay = prevDay + 1;
      AsyncStorage.setItem('currentDay', newDay.toString());
      return newDay;
    });
  };

  const decrementDay = () => {
    setCurrentDay((prevDay) => {
      const newDay = prevDay > 0 ? prevDay - 1 : 0;
      AsyncStorage.setItem('currentDay', newDay.toString());
      return newDay;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{t('Programme:title_hello')}, {fullName}!</Text>
      <Text style={styles.programName}>{programName}</Text>
      <View style={styles.dayContainer}>
        <TouchableOpacity style={styles.dayButton} onPress={decrementDay}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.dayText}>{t('Programme:info_day')} {currentDay}</Text>
        <TouchableOpacity style={styles.dayButton} onPress={incrementDay}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>{t('Programme:button_my_program_today')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  programName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#555',
    marginBottom: 30,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  startButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
