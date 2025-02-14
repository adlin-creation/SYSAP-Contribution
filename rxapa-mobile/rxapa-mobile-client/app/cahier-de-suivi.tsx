//objective: Create a form to track exercise sessions
//objective: Créer un formulaire pour suivre les séances d'exercice

/**
 * CahierDeSuiviScreen component
 * This component renders a form for tracking exercise sessions.
 * Users can input the number of exercises completed, difficulty level, satisfaction level, pain level, and walking time.
 * The form validates the inputs and displays error messages for missing fields.
 * On submission, the form data is sent to the server to create a session record.
 */
//objective: Create a form to track exercise sessions
//objective: Créer un formulaire pour suivre les séances d'exercice
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Modal, Portal, Provider, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import sessionService from '../services/sessionService'; // Import the session service
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for gradient background

interface Errors {
  exercisesCompleted?: string;
  difficultyLevel?: string;
  satisfactionLevel?: string;
  painLevel?: string;
  walkingTime?: string;
}

export default function CahierDeSuiviScreen() {
  const navigation = useNavigation(); // Initialize navigation
  const [exercisesCompleted, setExercisesCompleted] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [satisfactionLevel, setSatisfactionLevel] = useState('');
  const [painLevel, setPainLevel] = useState('');
  const [walkingHours, setWalkingHours] = useState('');
  const [walkingMinutes, setWalkingMinutes] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const updateTitle = (title: string): void => {
    setCurrentTitle(title);
  };

  const validateFields = () => {
    const newErrors: Errors = {};
    if (!exercisesCompleted) newErrors.exercisesCompleted = 'Veuillez choisir votre nombre d’exercices';
    if (!difficultyLevel) newErrors.difficultyLevel = 'Veuillez choisir votre difficulté';
    if (!satisfactionLevel) newErrors.satisfactionLevel = 'Veuillez choisir votre satisfaction';
    if (!painLevel) newErrors.painLevel = 'Veuillez choisir votre niveau de douleur';
    if (!walkingHours || !walkingMinutes) newErrors.walkingTime = 'Veuillez choisir votre temps de marche';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const walkingTime = parseInt(walkingHours) * 60 + parseInt(walkingMinutes); // Convert walking time to minutes

    const sessionData = {
      ProgramEnrollementId: 1, // Replace with the actual ID 
      difficultyLevel: parseInt(difficultyLevel) || 1,
      painLevel: parseInt(painLevel) || 1,
      satisfactionLevel: satisfactionLevel || 'NotSpecified',
      walkingTime: walkingTime,
      accomplishedExercice: exercisesCompleted || 'NotSpecified',
      SessionId: 1, // Replace with the actual session ID 
    };

    try {
      const response = await sessionService.createSessionRecord(sessionData);
      if (response.success) {
        Alert.alert('Succès', 'Session enregistrée avec succès');
        console.log('Session data:', response.data);
        navigation.navigate('home' as never); // Navigate to the home page
      } else {
        Alert.alert('Erreur', response.message || 'Échec de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la session:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const handleConfirmTimePicker = () => {
    if (walkingHours === '2') {
      setWalkingMinutes('0');
    }
    setShowTimePicker(false);
    updateTitle('Temps de marche effectué aujourd’hui');
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={['#e0f7fa', '#1B365D']} style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>Cahier de Suivi</Text>
            <Text style={styles.currentTitle}>{currentTitle}</Text>

            {/* Number of Exercises */}
            <Card style={[styles.card, exercisesCompleted ? styles.completedCard : errors.exercisesCompleted && styles.errorCard]}>
              <Text style={[styles.label, errors.exercisesCompleted && styles.errorLabel]}>Nombre d’exercices effectués aujourd’hui</Text>
              <Picker
                selectedValue={exercisesCompleted}
                onValueChange={(itemValue) => {
                  setExercisesCompleted(itemValue);
                  updateTitle('Nombre d’exercices effectués aujourd’hui');
                }}
                style={[styles.picker, errors.exercisesCompleted && styles.errorPicker]}
              >
                <Picker.Item label="Choisissez votre nombre d’exercices" value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
              </Picker>
              {errors.exercisesCompleted && <Text style={styles.errorText}>{errors.exercisesCompleted}</Text>}
            </Card>

            {/* Difficulty Level */}
            <Card style={[styles.card, difficultyLevel ? styles.completedCard : errors.difficultyLevel && styles.errorCard]}>
              <Text style={[styles.label, errors.difficultyLevel && styles.errorLabel]}>Difficulté ressentie durant votre séance</Text>
              <Picker
                selectedValue={difficultyLevel}
                onValueChange={(itemValue) => {
                  setDifficultyLevel(itemValue);
                  updateTitle('Difficulté ressentie durant votre séance');
                }}
                style={[styles.picker, errors.difficultyLevel && styles.errorPicker]}
              >
                <Picker.Item label="Choisissez votre difficulté" value="" />
                <Picker.Item label="Très difficile 😣" value="1" />
                <Picker.Item label="Difficile 😕" value="2" />
                <Picker.Item label="Facile 🙂" value="3" />
                <Picker.Item label="Très facile 😃" value="4" />
              </Picker>
              {errors.difficultyLevel && <Text style={styles.errorText}>{errors.difficultyLevel}</Text>}
            </Card>

            {/* Satisfaction Level */}
            <Card style={[styles.card, satisfactionLevel ? styles.completedCard : errors.satisfactionLevel && styles.errorCard]}>
              <Text style={[styles.label, errors.satisfactionLevel && styles.errorLabel]}>Satisfaction de votre séance du jour</Text>
              <Picker
                selectedValue={satisfactionLevel}
                onValueChange={(itemValue) => {
                  setSatisfactionLevel(itemValue);
                  updateTitle('Satisfaction de votre séance du jour');
                }}
                style={[styles.picker, errors.satisfactionLevel && styles.errorPicker]}
              >
                <Picker.Item label="Choisissez votre satisfaction" value="" />
                <Picker.Item label="Très insatisfait 😡" value="1" />
                <Picker.Item label="Insatisfait 😞" value="2" />
                <Picker.Item label="Satisfait 🙂" value="3" />
                <Picker.Item label="Très satisfait 😃" value="4" />
              </Picker>
              {errors.satisfactionLevel && <Text style={styles.errorText}>{errors.satisfactionLevel}</Text>}
            </Card>

            {/* Pain Level */}
            <Card style={[styles.card, painLevel ? styles.completedCard : errors.painLevel && styles.errorCard]}>
              <Text style={[styles.label, errors.painLevel && styles.errorLabel]}>Niveau de douleur ressenti durant la pratique</Text>
              <Picker
                selectedValue={painLevel}
                onValueChange={(itemValue) => {
                  setPainLevel(itemValue);
                  updateTitle('Niveau de douleur ressenti durant la pratique');
                }}
                style={[styles.picker, errors.painLevel && styles.errorPicker]}
              >
                <Picker.Item label="Choisissez votre niveau de douleur" value="" />
                <Picker.Item label="Aucune 😌" value="1" />
                <Picker.Item label="Légère 🙂" value="2" />
                <Picker.Item label="Modérée 😕" value="3" />
                <Picker.Item label="Intense 😣" value="4" />
              </Picker>
              {errors.painLevel && <Text style={styles.errorText}>{errors.painLevel}</Text>}
            </Card>

            {/* Walking Time */}
            <Card style={[styles.card, (walkingHours && walkingMinutes) ? styles.completedCard : errors.walkingTime && styles.errorCard]}>
              <Text style={[styles.label, errors.walkingTime && styles.errorLabel]}>Temps de marche effectué aujourd’hui</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.input, errors.walkingTime && styles.errorPicker]}>
                <Text style={styles.inputText}>
                  {walkingHours && walkingMinutes ? `${walkingHours}h ${walkingMinutes}m` : 'Choisissez votre temps de marche'}
                </Text>
              </TouchableOpacity>
              {errors.walkingTime && <Text style={styles.errorText}>{errors.walkingTime}</Text>}
              <Portal>
                <Modal visible={showTimePicker} onDismiss={() => setShowTimePicker(false)} contentContainerStyle={styles.modalContent}>
                  <Text style={styles.modalTitle}>Sélectionnez le temps de marche</Text>
                  <View style={styles.timeContainer}>
                    <Picker
                      selectedValue={walkingHours}
                      onValueChange={(itemValue) => {
                        setWalkingHours(itemValue);
                        if (itemValue === '2') {
                          setWalkingMinutes('0');
                        }
                      }}
                      style={[styles.picker, styles.timePicker]}
                    >
                      <Picker.Item label="Choisissez heure" value="" />
                      <Picker.Item label="0" value="0" />
                      <Picker.Item label="1" value="1" />
                      <Picker.Item label="2" value="2" />
                    </Picker>
                    <Text style={styles.timeSeparator}>h</Text>
                    <Picker
                      selectedValue={walkingMinutes}
                      onValueChange={(itemValue) => setWalkingMinutes(itemValue)}
                      style={[styles.picker, styles.timePicker]}
                      enabled={walkingHours !== '2'}
                    >
                      <Picker.Item label="Choisissez minute" value="" />
                      {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item key={i * 5} label={`${i * 5}`} value={`${i * 5}`} />
                      ))}
                    </Picker>
                    <Text style={styles.timeSeparator}>m</Text>
                  </View>
                  <TouchableOpacity style={styles.fullWidthButton} onPress={handleConfirmTimePicker}>
                    <Button mode="contained" style={styles.orangeButton}>CONFIRMER</Button>
                  </TouchableOpacity>
                </Modal>
              </Portal>
            </Card>

            {/* Submit Button */}
            <TouchableOpacity style={styles.fullWidthButton} onPress={handleSubmit}>
              <Button mode="contained" style={styles.orangeButton}>CONFIRMER</Button>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  currentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#DFF0D8',
  },
  errorCard: {
    backgroundColor: '#F8D7DA',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#1B365D',
  },
  errorLabel: {
    color: 'red',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  errorPicker: {
    borderColor: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#1B365D',
    textAlign: 'center',
  },
  inputText: {
    fontSize: 18,
  },
  orangeButton: {
    backgroundColor: '#FFA726',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1B365D',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePicker: {
    flex: 1,
  },
  timeSeparator: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 5,
    color: '#1B365D',
  },
  fullWidthButton: {
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
