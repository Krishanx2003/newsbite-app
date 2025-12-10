import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { ChevronLeft, Globe, Mail, Phone } from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactScreen() {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Contact Us</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.introText, { color: colors.muted }]}>
                    We'd love to hear from you! Get in touch with us through any of the following methods:
                </Text>

                {/* Email Section */}
                <View style={[styles.contactCard, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#000' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : '#EFF6FF' }]}>
                        <Mail size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { color: colors.muted }]}>Email Address</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:newsbiteteam@gmail.com')}>
                            <Text style={[styles.contactValue, { color: colors.tint }]}>newsbiteteam@gmail.com</Text>
                        </TouchableOpacity>
                        <Text style={[styles.contactDescription, { color: colors.muted }]}>
                            Send us an email for inquiries, feedback, or support. We typically respond within 24-48 hours.
                        </Text>
                    </View>
                </View>

                {/* Phone Section */}
                <View style={[styles.contactCard, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#000' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : '#EFF6FF' }]}>
                        <Phone size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { color: colors.muted }]}>Phone Number</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:+919837262798')}>
                            <Text style={[styles.contactValue, { color: colors.tint }]}>+91 9837-262-798</Text>
                        </TouchableOpacity>
                        <Text style={[styles.contactDescription, { color: colors.muted }]}>
                            Call us during business hours (9 AM - 6 PM IST, Monday-Friday) for immediate assistance.
                        </Text>
                    </View>
                </View>

                {/* Website Section */}
                <View style={[styles.contactCard, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#000' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : '#EFF6FF' }]}>
                        <Globe size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { color: colors.muted }]}>Website</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.newsbite.in')}>
                            <Text style={[styles.contactValue, { color: colors.tint }]}>www.newsbite.in</Text>
                        </TouchableOpacity>
                        <Text style={[styles.contactDescription, { color: colors.muted }]}>
                            Visit our website for more information about Newsbite and our services.
                        </Text>
                    </View>
                </View>

                <View style={[styles.footerNote, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
                    <Text style={[styles.footerText, { color: colors.muted }]}>
                        For news-related inquiries, content submissions, or partnership opportunities, please use the email address above.
                    </Text>
                </View>

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
    introText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    contactCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contactValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        textDecorationLine: 'underline',
    },
    contactDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    footerNote: {
        marginTop: 24,
        padding: 16,
        borderRadius: 8,
    },
    footerText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
});

