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
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const { t, i18n } = useTranslation();

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
    if (!exercisesCompleted) newErrors.exercisesCompleted = t('Cahier:err_choisir_nb_exercices');
    if (!difficultyLevel) newErrors.difficultyLevel = t('Cahier:err_choisir_difficulte');
    if (!satisfactionLevel) newErrors.satisfactionLevel = t('Cahier:err_choisir_satisfaction');
    if (!painLevel) newErrors.painLevel = t('Cahier:err_choisir_douleur');
    if (!walkingHours || !walkingMinutes) newErrors.walkingTime = t('Cahier:err_choisir_temps');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert(t('Cahier:erreur'), t('Cahier:err_remplir_champs'));
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
        Alert.alert(t('Cahier:succes'), t('Cahier:msg_session_enregistree'));
        console.log('Session data:', response.data);
        navigation.navigate('home' as never); // Navigate to the home page
      } else {
        Alert.alert(t('Cahier:erreur'), response.message || t('Cahier:err_echec_enregistrement_1'));
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la session:', error);
      Alert.alert(t('Cahier:erreur'), t('Cahier:err_echec_enregistrement_2'));
    }
  };

  const handleConfirmTimePicker = () => {
    if (walkingHours === '2') {
      setWalkingMinutes('0');
    }
    setShowTimePicker(false);
    updateTitle(t('Cahier:temps_marche'));
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={['#e0f7fa', '#1B365D']} style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>{t('Cahier:cahier_de_suivi')}</Text>
            <Text style={styles.currentTitle}>{currentTitle}</Text>

            {/* Number of Exercises */}
            <Card style={[styles.card, exercisesCompleted ? styles.completedCard : errors.exercisesCompleted && styles.errorCard]}>
              <Text style={[styles.label, errors.exercisesCompleted && styles.errorLabel]}>{t('Cahier:choisir_nombre_exercices')}</Text>
              <Picker
                selectedValue={exercisesCompleted}
                onValueChange={(itemValue) => {
                  setExercisesCompleted(itemValue);
                  updateTitle(t('Cahier:nombre_exercices'));
                }}
                style={[styles.picker, errors.exercisesCompleted && styles.errorPicker]}
              >
                <Picker.Item label={t('Cahier:choisir_nombre_exercices')} value="" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
              </Picker>
              {errors.exercisesCompleted && <Text style={styles.errorText}>{errors.exercisesCompleted}</Text>}
            </Card>

            {/* Difficulty Level */}
            <Card style={[styles.card, difficultyLevel ? styles.completedCard : errors.difficultyLevel && styles.errorCard]}>
              <Text style={[styles.label, errors.difficultyLevel && styles.errorLabel]}>{t('Cahier:difficulte_ressentie')}</Text>
              <Picker
                selectedValue={difficultyLevel}
                onValueChange={(itemValue) => {
                  setDifficultyLevel(itemValue);
                  updateTitle(t('Cahier:difficulte_ressentie'));
                }}
                style={[styles.picker, errors.difficultyLevel && styles.errorPicker]}
              >
                <Picker.Item label={t('Cahier:choisir_difficulte')} value="" />
                <Picker.Item label={t('Cahier:tres_difficile') + " 😣"} value="1" />
                <Picker.Item label={t('Cahier:difficile') + " 😕"} value="2" />
                <Picker.Item label={t('Cahier:facile') + " 🙂"} value="3" />
                <Picker.Item label={t('Cahier:tres_facile') + " 😃"} value="4" />
              </Picker>
              {errors.difficultyLevel && <Text style={styles.errorText}>{errors.difficultyLevel}</Text>}
            </Card>

            {/* Satisfaction Level */}
            <Card style={[styles.card, satisfactionLevel ? styles.completedCard : errors.satisfactionLevel && styles.errorCard]}>
              <Text style={[styles.label, errors.satisfactionLevel && styles.errorLabel]}>{t('Cahier:satisfaction')}</Text>
              <Picker
                selectedValue={satisfactionLevel}
                onValueChange={(itemValue) => {
                  setSatisfactionLevel(itemValue);
                  updateTitle(t('Cahier:satisfaction'));
                }}
                style={[styles.picker, errors.satisfactionLevel && styles.errorPicker]}
              >
                <Picker.Item label={t('Cahier:choisir_satisfaction')} value="" />
                <Picker.Item label={t('Cahier:tres_insatisfait') + " 😡"} value="1" />
                <Picker.Item label={t('Cahier:insatisfait') + " 😞"} value="2" />
                <Picker.Item label={t('Cahier:satisfait') + " 🙂"} value="3" />
                <Picker.Item label={t('Cahier:tres_satisfait') + " 😃"} value="4" />
              </Picker>
              {errors.satisfactionLevel && <Text style={styles.errorText}>{errors.satisfactionLevel}</Text>}
            </Card>

            {/* Pain Level */}
            <Card style={[styles.card, painLevel ? styles.completedCard : errors.painLevel && styles.errorCard]}>
              <Text style={[styles.label, errors.painLevel && styles.errorLabel]}>{t('Cahier:niveau_douleur')}</Text>
              <Picker
                selectedValue={painLevel}
                onValueChange={(itemValue) => {
                  setPainLevel(itemValue);
                  updateTitle(t('Cahier:niveau_douleur'));
                }}
                style={[styles.picker, errors.painLevel && styles.errorPicker]}
              >
                <Picker.Item label={t('Cahier:choisir_douleur')} value="" />
                <Picker.Item label={t('Cahier:douleur_aucune') + " 😌"} value="1" />
                <Picker.Item label={t('Cahier:douleur_legere') + " 🙂"} value="2" />
                <Picker.Item label={t('Cahier:douleur_moderee') + " 😕"} value="3" />
                <Picker.Item label={t('Cahier:douleur_intense') + " 😣"} value="4" />
              </Picker>
              {errors.painLevel && <Text style={styles.errorText}>{errors.painLevel}</Text>}
            </Card>

            {/* Walking Time */}
            <Card style={[styles.card, (walkingHours && walkingMinutes) ? styles.completedCard : errors.walkingTime && styles.errorCard]}>
              <Text style={[styles.label, errors.walkingTime && styles.errorLabel]}>{t('Cahier:temps_marche')}</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.input, errors.walkingTime && styles.errorPicker]}>
                <Text style={styles.inputText}>
                  {walkingHours && walkingMinutes ? `${walkingHours}h ${walkingMinutes}m` : t('Cahier:choisir_temps')}
                </Text>
              </TouchableOpacity>
              {errors.walkingTime && <Text style={styles.errorText}>{errors.walkingTime}</Text>}
              <Portal>
                <Modal visible={showTimePicker} onDismiss={() => setShowTimePicker(false)} contentContainerStyle={styles.modalContent}>
                  <Text style={styles.modalTitle}>{t('Cahier:selectionner_temps')}</Text>
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
                      <Picker.Item label={t('Cahier:choisir_heure')} value="" />
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
                      <Picker.Item label={t('Cahier:choisir_minute')} value="" />
                      {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item key={i * 5} label={`${i * 5}`} value={`${i * 5}`} />
                      ))}
                    </Picker>
                    <Text style={styles.timeSeparator}>m</Text>
                  </View>
                  <TouchableOpacity style={styles.fullWidthButton} onPress={handleConfirmTimePicker}>
                    <Button mode="contained" style={styles.orangeButton}>{t('Cahier:confirmer')}</Button>
                  </TouchableOpacity>
                </Modal>
              </Portal>
            </Card>

            {/* Submit Button */}
            <TouchableOpacity style={styles.fullWidthButton} onPress={handleSubmit}>
              <Button mode="contained" style={styles.orangeButton}>{t('Cahier:confirmer')}</Button>
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
