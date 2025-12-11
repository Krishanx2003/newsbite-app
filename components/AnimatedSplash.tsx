import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';

interface AnimatedSplashProps {
    onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
    const { colors } = useTheme();
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);
    const translateY = useSharedValue(0);

    useEffect(() => {
        // Start animation sequence
        opacity.value = withTiming(1, { duration: 800 });
        scale.value = withSpring(1, { damping: 12 });

        // After delay, animate out or signal finish
        translateY.value = withDelay(2000, withTiming(-50, { duration: 500 }, (finished) => {
            if (finished) {
                runOnJS(onFinish)();
            }
        }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ]
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={[styles.logoContainer, animatedStyle]}>
                <Image
                    source={require('@/assets/images/newsbite-logo.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    logoContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    }
});
