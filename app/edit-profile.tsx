import { useTheme } from '@/context/ThemeContext';
import { useUserActivity } from '@/context/UserActivityContext';
import { router } from 'expo-router';
import { ChevronLeft, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const { colors, isDark } = useTheme();
    const { userProfile, updateProfile } = useUserActivity();

    const [name, setName] = useState(userProfile.name);
    const [bio, setBio] = useState(userProfile.bio);

    const handleSave = () => {
        updateProfile({ name, bio });
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
                    <Save size={24} color={colors.tint} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.content}>

                        {/* Avatar Section (Visual only for now) */}
                        <View style={styles.avatarSection}>
                            <View style={[styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                                <Text style={[styles.avatarText, { color: colors.tint }]}>
                                    {name.charAt(0) || 'R'}
                                </Text>
                            </View>
                            <Text style={[styles.avatarHint, { color: colors.muted }]}>
                                Avatar is generated from your name
                            </Text>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Display Name</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: colors.card,
                                    color: colors.text,
                                    borderColor: colors.border
                                }]}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.muted}
                                value={name}
                                onChangeText={setName}
                                maxLength={20}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, {
                                    backgroundColor: colors.card,
                                    color: colors.text,
                                    borderColor: colors.border
                                }]}
                                placeholder="Tell us about yourself"
                                placeholderTextColor={colors.muted}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={4}
                                maxLength={80}
                                textAlignVertical="top"
                            />
                            <Text style={[styles.charCount, { color: colors.muted }]}>
                                {bio.length}/80 characters
                            </Text>
                        </View>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    iconBtn: {
        padding: 8,
    },
    content: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    avatarHint: {
        fontSize: 14,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    charCount: {
        alignSelf: 'flex-end',
        fontSize: 12,
        marginTop: 4,
        marginRight: 4,
    }
});
