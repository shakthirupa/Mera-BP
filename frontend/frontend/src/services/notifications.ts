import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API } from '../constants/api';
import { getAccessToken } from './tokenStorage';

function notificationsUnavailableInExpoGo(): boolean {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

async function getNotifications(): Promise<any | null> {
  if (Platform.OS === 'web' || notificationsUnavailableInExpoGo()) {
    return null;
  }

  const Notifications = await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medication-reminders', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return Notifications;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllReminders(): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

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
          title: 'Medication Reminder',
          body: `Time to take ${reminder.medicationName}`,
          sound: 'default',
          data: { reminderId: reminder.id },
          ...(Platform.OS === 'android' && { channelId: 'medication-reminders' }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
      });
    }

    console.log(`Scheduled ${reminders.length} medication reminders`);
  } catch (e) {
    console.log('Failed to schedule reminders:', e);
  }
}

export async function cancelAllReminders(): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
