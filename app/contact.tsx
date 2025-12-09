import { router } from 'expo-router';
import { ChevronLeft, Mail, Phone, Globe } from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Us</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.introText}>
                    We'd love to hear from you! Get in touch with us through any of the following methods:
                </Text>

                {/* Email Section */}
                <View style={styles.contactCard}>
                    <View style={styles.iconContainer}>
                        <Mail size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Email Address</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:newsbiteteam@gmail.com')}>
                            <Text style={styles.contactValue}>newsbiteteam@gmail.com</Text>
                        </TouchableOpacity>
                        <Text style={styles.contactDescription}>
                            Send us an email for inquiries, feedback, or support. We typically respond within 24-48 hours.
                        </Text>
                    </View>
                </View>

                {/* Phone Section */}
                <View style={styles.contactCard}>
                    <View style={styles.iconContainer}>
                        <Phone size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Phone Number</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:+919837262798')}>
                            <Text style={styles.contactValue}>+91 9837-262-798</Text>
                        </TouchableOpacity>
                        <Text style={styles.contactDescription}>
                            Call us during business hours (9 AM - 6 PM IST, Monday-Friday) for immediate assistance.
                        </Text>
                    </View>
                </View>

                {/* Website Section */}
                <View style={styles.contactCard}>
                    <View style={styles.iconContainer}>
                        <Globe size={24} color="#0EA5E9" />
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Website</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.newsbite.in')}>
                            <Text style={styles.contactValue}>www.newsbite.in</Text>
                        </TouchableOpacity>
                        <Text style={styles.contactDescription}>
                            Visit our website for more information about Newsbite and our services.
                        </Text>
                    </View>
                </View>

                <View style={styles.footerNote}>
                    <Text style={styles.footerText}>
                        For news-related inquiries, content submissions, or partnership opportunities, please use the email address above.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: { padding: 4 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    content: { padding: 20 },
    introText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 24,
    },
    contactCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        shadowColor: '#000000',
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
        backgroundColor: '#EFF6FF',
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
        color: '#6B7280',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contactValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0EA5E9',
        marginBottom: 8,
        textDecorationLine: 'underline',
    },
    contactDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    footerNote: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        textAlign: 'center',
    },
});

