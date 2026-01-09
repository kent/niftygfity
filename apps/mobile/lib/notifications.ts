import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { router } from "expo-router";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get the Expo push token.
 * Returns null if running in simulator or permission denied.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission denied");
    return null;
  }

  // Get the Expo push token
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    return token.data;
  } catch (error) {
    console.error("Failed to get push token:", error);
    return null;
  }
}

/**
 * Set up Android notification channel (required for Android)
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#8b5cf6",
    });
  }
}

/**
 * Handle notification response (when user taps a notification)
 */
export function setupNotificationHandlers(): () => void {
  // Handle notification tap
  const subscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as unknown as NotificationData;

    // Navigate based on notification type
    switch (data.type) {
      case "exchange_invite":
        if (data.token) {
          router.push(`/join/exchange/${data.token}`);
        }
        break;

      case "match_revealed":
        if (data.exchangeId) {
          router.push(`/(tabs)/exchanges/${data.exchangeId}/my-match`);
        }
        break;

      case "wishlist_updated":
        if (data.exchangeId) {
          router.push(`/(tabs)/exchanges/${data.exchangeId}/my-match`);
        }
        break;

      default:
        // Default to exchanges list
        router.push("/(tabs)/exchanges");
    }
  });

  // Return cleanup function
  return () => {
    subscription.remove();
  };
}

/**
 * Get the last notification response (for handling notification that opened the app)
 */
export async function getInitialNotification(): Promise<Notifications.NotificationResponse | null> {
  return await Notifications.getLastNotificationResponseAsync();
}

// Notification types for reference
export interface NotificationData {
  type: "exchange_invite" | "match_revealed" | "wishlist_updated";
  token?: string; // For exchange_invite
  exchangeId?: number; // For match_revealed and wishlist_updated
}
