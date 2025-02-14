interface Reminder {
    id: number;
    time: string; // Heure sous format HH:MM
    melody: string; // Nom de la mélodie
  }
  
  class ReminderService {
    private reminders: Reminder[] = [];
  
    addReminder(reminder: Reminder) {
      this.reminders.push(reminder);
    }
  
    getReminders(): Reminder[] {
      return this.reminders;
    }
  
    removeReminder(id: number) {
      this.reminders = this.reminders.filter((r) => r.id !== id);
    }
  }
  
  export default ReminderService;
  