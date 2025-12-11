import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { ArrowLeft, Mail, Lock, User, Loader2, EyeOff, Eye } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignupScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { register } = useAuth();

    // Currently backend only takes email/pass, name might be extra or unused? 
    // auth.ts only has email, password in zod schema.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            await register(email, password);
            Alert.alert('Success', 'Account created successfully');
            router.replace('/(tabs)');
        } catch (e: any) {
            Alert.alert('Registration Failed', e.message || 'An error occurred during sign up');
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
                    <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>Join Newsbite today</Text>
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

                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Lock size={20} color={colors.muted} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.muted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? (
                                <EyeOff size={20} color={colors.muted} />
                            ) : (
                                <Eye size={20} color={colors.muted} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.signupButton, { backgroundColor: colors.tint }]}
                        onPress={handleSignup}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 size={24} color="#FFF" style={styles.loader} />
                        ) : (
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.muted }]}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                        <Text style={[styles.loginText, { color: colors.tint }]}>Sign In</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // ... Copy styles from Login, adjust as needed
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
    signupButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        elevation: 2,
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
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
    loginText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
