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
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

const { t, i18n } = useTranslation();

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
        Alert.alert(t('Config:error_permission_denied'), t('Config:error_notifications_required'));
      }
    };
    requestPermissions();
  }, []);

  const addReminder = async () => {
    if (!selectedTime || !newTitle) {
      Alert.alert(t('Config:error_error'), t("Config:error_time_and_title_required"));
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
          title: `${t("Config:title_reminder")}: ${newTitle} 📅`,
          body: t('Config:title_reminder_subtitle'),
          sound: 'default',
        },
        trigger: trigger as Notifications.DailyTriggerInput,
      });

      setReminders([...reminders, newReminder]);
      setShowModal(false);
      Alert.alert(t('Config:success_reminder_added'), `${t('Config:success_reminder_added_to')} ${selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      Alert.alert(t('Config:error_error'), t("Config:error_reminder_creation"));
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    Alert.alert(t('Config:success_reminder_deleted'), t("Config:success_reminder_deleted_subtitle"));
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#1B365D']} style={styles.container}>
      <Text style={styles.header}>{t('Config:title_programmed_reminders')}</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noReminderText}>{t('Config:title_no_reminders')}</Text>}
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
              <Text style={styles.deleteButtonText}>{t('Config:button_delete')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>+ {t('Config:button_add_reminder')}</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{t('Config:title_new_reminder')}</Text>
            <TextInput
              placeholder={t('Config:placeholder_reminder_title')}
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <Text style={styles.label}>{t('Config:placeholder_select_time')} :</Text>
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
                <Text style={styles.modalButtonText}>{t('Config:button_schedule_reminder')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>{t('Config:button_cancel_reminder')}</Text>
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
