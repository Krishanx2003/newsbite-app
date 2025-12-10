import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Terms & Conditions</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.lastUpdated, { color: colors.muted }]}>Last Updated: December 7, 2025</Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Agreement to Terms</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    By accessing or using our application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Use License</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Newsbite's application for personal, non-commercial transitory viewing only.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>3. User Account</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    To access certain features of the application, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Termination</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Governing Law</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
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
    backBtn: { padding: 4 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: { padding: 20 },
    lastUpdated: {
        fontSize: 14,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 12,
    },
});
