import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API } from '../constants/api';
import { getAccessToken } from './tokenStorage';

// ── Configure how notifications appear when app is in foreground ──────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
  }),
});

// ── Request permission ────────────────────────────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ── Schedule all reminders for the logged-in patient ─────────────────────────
// Cancels all existing scheduled notifications and reschedules from the server.
// Call this on login and whenever reminders change.

export async function scheduleAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  // Cancel all previously scheduled reminder notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  try {
    const token = await getAccessToken();
    if (!token) return;

    const res = await fetch(API.REMINDERS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;

    const reminders: { id: number; medicationName: string; reminderTime: string }[] = await res.json();

    for (const reminder of reminders) {
      const [hours, minutes] = reminder.reminderTime.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💊 Medication Reminder',
          body:  `Time to take ${reminder.medicationName}`,
          sound: true,
          data:  { reminderId: reminder.id },
        },
        trigger: {
          type:    Notifications.SchedulableTriggerInputTypes.DAILY,
          hour:    hours,
          minute:  minutes,
        },
      });
    }

    console.log(`Scheduled ${reminders.length} medication reminders`);
  } catch (e) {
    console.log('Failed to schedule reminders:', e);
  }
}

// ── Cancel all reminders (call on logout) ─────────────────────────────────────
export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
