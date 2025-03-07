// objective: Create a screen to display the exercises of a session
// objective: Créer un écran pour afficher les exercices d'une séance
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SeanceService from '../services/seanceService';
import YouTube from 'react-native-youtube-iframe';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

interface Exercise {
  exerciseName: string;
  exerciseDescription: string;
  instructionalVideo: string;
  imageUrl: string;
  numberOfRepetition: number;
  numberOfSeries: number;
  restingInstruction: string;
  required: boolean;
}

export default function SeanceScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<{ [key: number]: boolean }>({});

  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const programEnrollementId = await AsyncStorage.getItem('programEnrollementId');
      if (!programEnrollementId) {
        alert(t('Seance:err_id_programme'));
        return;
      }

      const response = await SeanceService.getExercisesByProgramEnrollementId(Number(programEnrollementId));
      if (response.success) {
        setExercises(response.data);
      } else {
        alert(response.message || t('Seance:err_aucun_exercice'));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      alert(t('Seance:err_recuperation_exercices'));
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const handleVideoEnd = (index: number) => {
    setCompletedVideos((prevState) => ({ ...prevState, [index]: true }));
  };

  const screenWidth = Dimensions.get('window').width; // Obtenir la largeur de l'écran

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
        <Text>{t('Seance:chargement_exercices')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('Seance:liste_exercices')}</Text>
      {exercises.length === 0 ? (
        <Text style={styles.noExerciseText}>{t('Seance:aucun_exercice')}</Text>
      ) : (
        exercises.map((exercise, index) => (
          <View
            key={index}
            style={[
              styles.exerciseContainer,
              completedVideos[index] ? styles.completedContainer : styles.defaultContainer,
            ]}
          >
            {/* Vidéo explicative */}
            {exercise.instructionalVideo && (
              <View style={styles.videoContainer}>
                <YouTube
                  videoId={getYoutubeVideoId(exercise.instructionalVideo) || ''}
                  height={200}
                  width={screenWidth - 40} // Largeur ajustée en fonction de l'écran avec des marges
                  onChangeState={(event) => {
                    if (event === 'ended') {
                      handleVideoEnd(index);
                    }
                  }}
                  play={false}
                />
              </View>
            )}

            {/* Titre et description */}
            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
            <Text style={styles.exerciseDescription}>{exercise.exerciseDescription}</Text>

            {/* Détails répétitions, séries, repos */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailBox}>
                <Text style={styles.detailTitle}>Répétitions</Text>
                <Text style={styles.detailValue}>{exercise.numberOfRepetition}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailTitle}>Séries</Text>
                <Text style={styles.detailValue}>{exercise.numberOfSeries}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailTitle}>Repos</Text>
                <Text style={styles.detailValue}>{exercise.restingInstruction}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#1B365D' },
  exerciseContainer: { marginBottom: 20, padding: 15, borderRadius: 10, elevation: 3 },
  defaultContainer: { backgroundColor: '#f9f9f9' },
  completedContainer: { backgroundColor: '#d4edda' }, // Couleur verte après la fin de la vidéo
  exerciseName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },
  exerciseDescription: { fontSize: 16, marginBottom: 10, color: '#666' },
  detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  detailBox: { alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  detailTitle: { fontSize: 14, fontWeight: '600', color: '#777' },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 5 },
  videoContainer: { marginBottom: 10, borderRadius: 10, overflow: 'hidden' },
  noExerciseText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#666' },
});
