import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus, Platform, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Device from 'expo-device';
import * as ScreenCapture from 'expo-screen-capture';
import { StorageService } from '@/services/storage.service';

interface SecurityContextType {
    isLocked: boolean;
    isRooted: boolean;
    isAppLockEnabled: boolean;
    authenticate: () => Promise<boolean>;
    setScreenPrivacy: (enable: boolean) => Promise<void>;
    toggleAppLock: (enable: boolean) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
    const [isLocked, setIsLocked] = useState(false); // Default false, will check storage
    const [isRooted, setIsRooted] = useState(false);
    const [isAppLockEnabled, setIsAppLockEnabled] = useState(false);
    const appState = useRef(AppState.currentState);
    const [isLoaded, setIsLoaded] = useState(false);
    const isAuthenticating = useRef(false);

    // 1. Root/Jailbreak Detection
    useEffect(() => {
        async function checkRoot() {
            if (Platform.OS === 'web') return;

            const rooted = await Device.isRootedExperimentalAsync();
            if (rooted) {
                setIsRooted(true);
                Alert.alert(
                    'Security Warning',
                    'This device appears to be rooted/jailbroken. Newsbite may not function securely.',
                    [{ text: 'I understand' }]
                );
            }
        }
        checkRoot();
    }, []);

    // 2. Load Settings & Initial Authentication
    useEffect(() => {
        async function loadSettings() {
            // Load enabled state
            const enabled = await StorageService.getItem<boolean>('app_lock_enabled');
            setIsAppLockEnabled(!!enabled);

            if (enabled) {
                setIsLocked(true); // Lock immediately if enabled
                authenticate(true); // Trigger auth
            }
            setIsLoaded(true);
        }
        loadSettings();
    }, []);

    // 3. Auto-lock on background
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            // Only lock if feature is enabled
            if (!isAppLockEnabled) {
                appState.current = nextAppState;
                return;
            }

            if (
                appState.current.match(/active/) &&
                nextAppState.match(/inactive|background/)
            ) {
                // App went to background -> Lock it
                if (Platform.OS !== 'web') {
                    setIsLocked(true);
                    // Privacy: Blur screen in switcher
                    await ScreenCapture.preventScreenCaptureAsync();
                }
            }

            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App came to foreground -> Prompt Auth
                // Only prompt if locked AND not currently trying to auth
                if (isLocked && !isAuthenticating.current) {
                    authenticate(true);
                }
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isLocked, isAppLockEnabled]);

    const authenticate = async (force: boolean = false): Promise<boolean> => {
        if (Platform.OS === 'web') {
            setIsLocked(false);
            return true;
        }

        if (!isAppLockEnabled && !force) {
            setIsLocked(false);
            return true;
        }

        // Prevent re-entry if already showing prompt
        if (isAuthenticating.current) return false;
        isAuthenticating.current = true;

        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                setIsLocked(false);
                isAuthenticating.current = false;
                return true;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Newsbite',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel'
            });

            if (result.success) {
                setIsLocked(false);
                isAuthenticating.current = false;
                return true;
            } else {
                // Failed or Canceled
                isAuthenticating.current = false;
                return false;
            }
        } catch (e) {
            console.error('Auth error', e);
            isAuthenticating.current = false;
            return false;
        }
    };

    const toggleAppLock = async (enable: boolean) => {
        setIsAppLockEnabled(enable);
        await StorageService.setItem('app_lock_enabled', enable);
        if (enable) {
            setIsLocked(true);
            authenticate(true);
        } else {
            setIsLocked(false);
        }
    };

    const setScreenPrivacy = async (enable: boolean) => {
        if (Platform.OS === 'web') return;
        if (enable) {
            await ScreenCapture.preventScreenCaptureAsync();
        } else {
            await ScreenCapture.allowScreenCaptureAsync();
        }
    };

    return (
        <SecurityContext.Provider value={{
            isLocked,
            isRooted,
            isAppLockEnabled,
            authenticate: () => authenticate(false), // Default safe call
            setScreenPrivacy,
            toggleAppLock
        }}>
            {children}
        </SecurityContext.Provider>
    );
}

export const useSecurity = () => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurity must be used within a SecurityProvider');
    }
    return context;
};
