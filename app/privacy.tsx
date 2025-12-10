import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.lastUpdated, { color: colors.muted }]}>Last Updated: December 7, 2025</Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Introduction</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    Welcome to Newsbite. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights and how the law protects you.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Data We Collect</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    {'\n'}• Identity Data: includes username or similar identifier.
                    {'\n'}• Contact Data: includes email address.
                    {'\n'}• Usage Data: includes information about how you use our app.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>3. How We Use Your Data</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    {'\n'}• To register you as a new customer.
                    {'\n'}• To manage our relationship with you.
                    {'\n'}• To improve our website, products/services, marketing or customer relationships.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Data Security</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                </Text>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Contact Us</Text>
                <Text style={[styles.paragraph, { color: colors.muted }]}>
                    If you have any questions about this privacy policy or our privacy practices, please contact us at: newsbiteteam@gmail.com
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
