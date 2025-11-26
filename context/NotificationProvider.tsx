import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure notifications handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowPreview: true,
    }),
});

interface NotificationContextType {
    expoPushToken: string | undefined;
    notification: Notifications.Notification | undefined;
    socket: Socket | undefined;
}

const NotificationContext = createContext<NotificationContextType>({
    expoPushToken: undefined,
    notification: undefined,
    socket: undefined,
});

export const useNotification = () => useContext(NotificationContext);

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.x:3001'; // Update with your local IP for device testing

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        // Socket.io connection
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'], // Force websocket for React Native
        });

        newSocket.on('connect', () => {
            console.log('App connected to socket server:', newSocket.id);
        });

        newSocket.on('notification', (data) => {
            console.log('App received socket notification:', data);
            // You can trigger a local notification here if the app is in foreground and you want consistent UI
            Notifications.scheduleNotificationAsync({
                content: {
                    title: data.title,
                    body: data.body,
                    data: data.data,
                },
                trigger: null, // Show immediately
            });
        });

        setSocket(newSocket);

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
            newSocket.disconnect();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ expoPushToken, notification, socket }}>
            {children}
        </NotificationContext.Provider>
    );
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
        // For development without projectId configured yet:
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Expo Push Token:', token);
        } catch (e) {
            console.error("Error getting push token:", e);
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
