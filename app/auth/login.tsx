import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { ArrowLeft, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await login(email, password);
            Alert.alert('Success', 'Logged in successfully');
            router.replace('/(tabs)');
        } catch (e: any) {
            Alert.alert('Login Failed', e.message || 'An error occurred during login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <Image source={require('@/assets/images/newsbite-logo.png')} style={styles.logo} contentFit="contain" />
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>Sign in to continue to Newsbite</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Mail size={20} color={colors.muted} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Email"
                            placeholderTextColor={colors.muted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Lock size={20} color={colors.muted} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Password"
                            placeholderTextColor={colors.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <EyeOff size={20} color={colors.muted} />
                            ) : (
                                <Eye size={20} color={colors.muted} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={[styles.forgotText, { color: colors.tint }]}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: colors.tint }]}
                        onPress={handleLogin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 size={24} color="#FFF" style={styles.loader} /> // Animating loader manually or assume css works? rotate prop needed
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Google Auth Placeholder */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.muted }]}>OR</Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>

                    <TouchableOpacity
                        style={[styles.googleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => Alert.alert('Coming Soon', 'Google Sign-In is being configured.')}
                    >
                        {/* Placeholder Icon */}
                        <Text style={[styles.googleButtonText, { color: colors.text }]}>Continue with Google</Text>
                    </TouchableOpacity>

                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.muted }]}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/auth/signup')}>
                        <Text style={[styles.signupText, { color: colors.tint }]}>Sign Up</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        marginBottom: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        elevation: 2,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        // animation would require reanimated rotation
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
    },
    googleButton: {
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: 32,
    },
    footerText: {
        fontSize: 14,
    },
    signupText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
