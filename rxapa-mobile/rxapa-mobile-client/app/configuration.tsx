import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface Reminder {
  id: string;
  time: Date;
  title: string;
}

export default function ReminderNotification() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Activez les notifications pour recevoir les rappels.');
      }
    };
    requestPermissions();
  }, []);

  const addReminder = async () => {
    if (!selectedTime || !newTitle) {
      Alert.alert('Erreur', 'Veuillez sélectionner une heure et un titre.');
      return;
    }

    const newReminder: Reminder = {
      id: Math.random().toString(),
      time: selectedTime,
      title: newTitle,
    };

    const trigger = {
      type: 'daily',
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rappel: ${newTitle} 📅`,
          body: 'Il est temps de faire votre séance !',
          sound: 'default',
        },
        trigger: trigger as Notifications.DailyTriggerInput,
      });

      setReminders([...reminders, newReminder]);
      setShowModal(false);
      Alert.alert('Rappel ajouté', `Rappel ajouté à ${selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de programmer le rappel.');
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    Alert.alert('Rappel supprimé', 'Le rappel a été supprimé.');
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#1B365D']} style={styles.container}>
      <Text style={styles.header}>Rappels programmés</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noReminderText}>Aucun rappel pour l'instant.</Text>}
        renderItem={({ item }) => (
          <View style={styles.reminderCard}>
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderTitle}>{item.title}</Text>
              <Text style={styles.reminderTime}>
                {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteReminder(item.id)}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+ Ajouter un rappel</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Nouveau Rappel</Text>
            <TextInput
              placeholder="Titre du rappel"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <Text style={styles.label}>Sélectionnez l'heure :</Text>
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                if (date) setSelectedTime(date);
              }}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.planButton]} onPress={addReminder}>
                <Text style={styles.modalButtonText}>Planifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: 10 },
  noReminderText: { textAlign: 'center', color: '#fff', fontSize: 16, marginVertical: 20 },
  reminderCard: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 15, borderRadius: 10, marginBottom: 10 },
  reminderTextContainer: { flex: 1 },
  reminderTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B365D' },
  reminderTime: { fontSize: 16, color: '#1B365D' },
  deleteButton: { backgroundColor: '#FF5252', padding: 10, borderRadius: 5 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  addButton: { backgroundColor: '#FFA726', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' },
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1B365D' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, fontSize: 16, padding: 5, color: '#1B365D' },
  label: { fontSize: 16, marginBottom: 10, color: '#1B365D' },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalButton: { padding: 15, borderRadius: 10, width: '45%', alignItems: 'center' },
  planButton: { backgroundColor: '#4CAF50' },
  cancelButton: { backgroundColor: '#FF5252' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
