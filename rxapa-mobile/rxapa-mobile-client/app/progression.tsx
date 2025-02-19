//objective: Create a screen to display the user's progression
//objective: Créer un écran pour afficher la progression de l'utilisateur
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ProgressBar, Card } from 'react-native-paper';
import { ProgressionService } from '../services/progressionService';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for larger icons
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const { t, i18n } = useTranslation();

export default function MaProgressionScreen() {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState<string[][]>([]);
  const [data, setData] = useState({
    avgDifficulty: '0.00',
    avgPainLevel: '0.00',
    totalWalkingTime: 0,
    totalExercises: 0,
    avgSatisfactionLevel: '0.00',
  });
  const [completionRate, setCompletionRate] = useState(0);
  const [isAllPeriod, setIsAllPeriod] = useState(false);

  useEffect(() => {
    generateWeeks();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedWeekIndex, isAllPeriod]);

  const generateWeeks = () => {
    const generatedWeeks: string[][] = [];
    const programStartDate = new Date(2024, 9, 8);
    let currentStartDate = new Date(programStartDate);
    const today = new Date();

    while (currentStartDate <= today) {
      const currentEndDate = new Date(currentStartDate);
      currentEndDate.setDate(currentStartDate.getDate() + 6);
      generatedWeeks.push([
        `${t('Progression:semaine')} ${generatedWeeks.length + 1}`,
        `${currentStartDate.toLocaleDateString('fr-FR')} - ${currentEndDate.toLocaleDateString('fr-FR')}`,
      ]);
      currentStartDate.setDate(currentStartDate.getDate() + 7);
    }
    setWeeks(generatedWeeks);
  };

  const fetchData = async () => {
    try {
      const filterType = isAllPeriod ? 'all' : 'week';
      const result = await ProgressionService.fetchStatistics(1, filterType);
      const fetchedData = isAllPeriod ? result.data[0] : result.data[selectedWeekIndex] || {};
      const rate =
        fetchedData.totalExercises > 0
          ? (fetchedData.totalExercises / (fetchedData.sessionCount * 4)) * 100
          : 0;
      setCompletionRate(Math.round(rate));
      setData({
        avgDifficulty: parseFloat(fetchedData.avgDifficulty || '0').toFixed(2),
        avgPainLevel: parseFloat(fetchedData.avgPainLevel || '0').toFixed(2),
        totalWalkingTime: fetchedData.totalWalkingTime || 0,
        totalExercises: fetchedData.totalExercises || 0,
        avgSatisfactionLevel: parseFloat(fetchedData.avgSatisfactionLevel || '0').toFixed(2),
      });
    } catch (error) {
      console.error('Erreur dans fetchStatistics:', error);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWeekIndex > 0) {
      setSelectedWeekIndex(selectedWeekIndex - 1);
    } else if (direction === 'next' && selectedWeekIndex < weeks.length - 1) {
      setSelectedWeekIndex(selectedWeekIndex + 1);
    }
  };

  const formatWalkingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('Progression:ma_progression')}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, !isAllPeriod && styles.selectedOption]}
          onPress={() => setIsAllPeriod(false)}
        >
          <Text style={styles.optionText}>{t('Progression:la_semaine')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, isAllPeriod && styles.selectedOption]}
          onPress={() => setIsAllPeriod(true)}
        >
          <Text style={styles.optionText}>{t('Progression:depuis_le_debut')}</Text>
        </TouchableOpacity>
      </View>

      {!isAllPeriod && (
        <View style={styles.weekNav}>
          <TouchableOpacity
            style={[styles.navButton, selectedWeekIndex === 0 && styles.disabledButton]}
            onPress={() => navigateWeek('prev')}
            disabled={selectedWeekIndex === 0}
          >
            <Ionicons name="arrow-back-circle" size={40} color={selectedWeekIndex === 0 ? "#ccc" : "#1565C0"} />
          </TouchableOpacity>
          <View style={styles.weekInfo}>
            <Text style={styles.weekTitle}>{weeks[selectedWeekIndex]?.[0]}</Text>
            <Text style={styles.weekDates}>{weeks[selectedWeekIndex]?.[1]}</Text>
          </View>
          <TouchableOpacity
            style={[styles.navButton, selectedWeekIndex === weeks.length - 1 && styles.disabledButton]}
            onPress={() => navigateWeek('next')}
            disabled={selectedWeekIndex === weeks.length - 1}
          >
            <Ionicons name="arrow-forward-circle" size={40} color={selectedWeekIndex === weeks.length - 1 ? "#ccc" : "#1565C0"} />
          </TouchableOpacity>
        </View>
      )}

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t('Progression:taux_completion')}</Text>
        <ProgressBar progress={completionRate / 100} color="#4CAF50" style={styles.progressBar} />
        <Text style={styles.progressText}>{completionRate}%</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{isAllPeriod ? 'Statistiques depuis le début' : 'Statistiques de la semaine'}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>⚙️ {t('Progression:difficulte_moyenne')} :</Text>
            <Text style={styles.statsValue}>{data.avgDifficulty}/4</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>❤️ {t('Progression:douleur_moyenne')} :</Text>
            <Text style={styles.statsValue}>{data.avgPainLevel}/4</Text>
          </View>
          <View style={styles.statsRow}>
           <Text style={styles.statsLabel}>😊 {t('Progression:satisfaction_moyenne')} :</Text>
           <Text style={styles.statsValue}>{data.avgSatisfactionLevel}/5</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>🕒 {t('Progression:temps_marche')} :</Text>
            <Text style={styles.statsValue}>{formatWalkingTime(data.totalWalkingTime)}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>🏋️ {t('Progression:total_exercices')} :</Text>
            <Text style={styles.statsValue}>{data.totalExercises}</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', padding: 15 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  optionButton: { padding: 10, borderRadius: 20, backgroundColor: '#E0E0E0', marginHorizontal: 10 },
  selectedOption: { backgroundColor: '#1565C0' },
  optionText: { color: '#FFF' },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  navButton: { padding: 10 },
  disabledButton: { opacity: 0.5 },
  navButtonText: { fontSize: 20 },
  weekInfo: { alignItems: 'center' },
  weekTitle: { fontSize: 16, fontWeight: 'bold' },
  weekDates: { fontSize: 14 }, 
  card: { marginBottom: 15, padding: 15, borderRadius: 10, elevation: 2, backgroundColor: '#FFF' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  progressBar: { height: 10, borderRadius: 5 },
  progressText: { textAlign: 'center', marginTop: 5 },
  statsContainer: { marginTop: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  statsLabel: { fontSize: 16 },
  statsValue: { fontSize: 16, fontWeight: 'bold' },
});
