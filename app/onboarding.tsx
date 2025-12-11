import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useOnboarding } from '@/context/OnboardingContext';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowRight, Check, X } from 'lucide-react-native'; // Added X icon
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Welcome to Newsbite',
        description: 'Your personalized news companion. Stay updated with what matters most to you.',
        image: require('@/assets/images/newsbite-logo.png'),
        color: '#FF6B6B'
    },
    {
        id: '2',
        title: 'Curated for You',
        description: 'Customize your feed with topics you love. Global news, Tech, Sports, and more.',
        image: require('@/assets/images/newsbite-logo.png'),
        color: '#4ECDC4'
    },
    {
        id: '3',
        title: 'Get Started',
        description: 'Sign in to save your regular reads and bookmarks. Or dive right in as a guest.',
        image: require('@/assets/images/newsbite-logo.png'),
        color: '#45B7D1'
    }
];

export default function OnboardingScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const isReplay = params.replay === 'true';

    const { completeOnboarding } = useOnboarding();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < SLIDES.length - 1) {
            pagerRef.current?.setPage(currentPage + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        if (!isReplay) {
            await completeOnboarding();
            router.replace('/(tabs)');
        } else {
            router.back();
        }
    };

    const handleSkip = async () => {
        if (!isReplay) {
            await completeOnboarding();
            router.replace('/(tabs)');
        } else {
            router.back();
        }
    };

    // Need simpler handling for initial implementation
    // Just a clean design with "Get Started" on the last page

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={[styles.skipText, { color: colors.muted }]}>
                        {isReplay ? 'Close' : 'Skip'}
                    </Text>
                </TouchableOpacity>
            </View>

            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {SLIDES.map((slide, index) => (
                    <View key={slide.id} style={styles.page}>
                        <Animated.View exiting={FadeIn.delay(200)} entering={FadeInDown.delay(100)} style={styles.imageContainer}>
                            <Image source={slide.image} style={styles.image} contentFit="contain" />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(300).springify()}>
                            <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
                            <Text style={[styles.description, { color: colors.muted }]}>{slide.description}</Text>
                        </Animated.View>

                        {/* Special UI for Last Slide */}
                        {index === SLIDES.length - 1 && (
                            <View style={styles.authContainer}>
                                {!isReplay ? (
                                    <>
                                        <TouchableOpacity
                                            style={[styles.authButton, { backgroundColor: colors.tint }]}
                                            onPress={handleFinish}
                                        >
                                            <Text style={styles.authButtonText}>Sign In with Google</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.secondaryButton, { borderColor: colors.border }]}
                                            onPress={handleFinish}
                                        >
                                            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Continue as Guest</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.authButton, { backgroundColor: colors.tint }]}
                                        onPress={handleFinish}
                                    >
                                        <Text style={styles.authButtonText}>Close Tour</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </PagerView>

            {/* Footer Navigation (Dots & Next Fab) - Only show if NOT last page */}
            {currentPage < SLIDES.length - 1 && (
                <View style={styles.footer}>
                    <View style={styles.dotsContainer}>
                        {SLIDES.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { backgroundColor: i === currentPage ? colors.tint : colors.border }
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: colors.tint }]}
                        onPress={handleNext}
                    >
                        <ArrowRight color="#FFF" size={24} />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '500',
    },
    pagerView: {
        flex: 1,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    imageContainer: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    nextButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    authContainer: {
        marginTop: 40,
        width: '100%',
        gap: 16,
    },
    authButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
