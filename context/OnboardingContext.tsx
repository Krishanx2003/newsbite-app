import React, { createContext, useContext, useEffect, useState } from 'react';
import { StorageService } from '@/services/storage.service';

const ONBOARDING_KEY = 'has_seen_onboarding';

interface OnboardingContextType {
    hasSeenOnboarding: boolean | null;
    isLoading: boolean;
    completeOnboarding: () => Promise<void>;
    resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const hasSeen = await StorageService.getItem<boolean>(ONBOARDING_KEY);
            setHasSeenOnboarding(!!hasSeen);
        } catch (e) {
            console.error('Error checking onboarding status', e);
            setHasSeenOnboarding(false);
        } finally {
            setIsLoading(false);
        }
    };

    const completeOnboarding = async () => {
        try {
            await StorageService.setItem(ONBOARDING_KEY, true);
            setHasSeenOnboarding(true);
        } catch (e) {
            console.error('Error saving onboarding status', e);
        }
    };

    const resetOnboarding = async () => {
        try {
            await StorageService.removeItem(ONBOARDING_KEY);
            setHasSeenOnboarding(false);
        } catch (e) {
            console.error('Error resetting onboarding status', e);
        }
    };

    return (
        <OnboardingContext.Provider value={{
            hasSeenOnboarding,
            isLoading,
            completeOnboarding,
            resetOnboarding
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
