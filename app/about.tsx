import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Newsbite</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>NB</Text>
                    </View>
                    <Text style={styles.appName}>Newsbite</Text>
                    <Text style={styles.version}>Version 1.0.2</Text>
                </View>

                <Text style={styles.sectionTitle}>Our Mission</Text>
                <Text style={styles.paragraph}>
                    Newsbite is dedicated to delivering the most relevant and important news stories in a concise, easy-to-read format. We believe in keeping you informed without overwhelming you.
                </Text>

                <Text style={styles.sectionTitle}>Ownership</Text>
                <Text style={styles.paragraph}>
                    Newsbite is owned and operated by Krishanx2003. We are an independent news aggregator committed to unbiased reporting.
                </Text>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:newsbiteteam@gmail.com')}>
                    <Text style={[styles.paragraph, { color: '#0EA5E9', textDecorationLine: 'underline' }]}>
                        Email: newsbiteteam@gmail.com
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('tel:+919837262798')}>
                    <Text style={[styles.paragraph, { color: '#0EA5E9', textDecorationLine: 'underline' }]}>
                        Phone: +91 9837-262-798
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.newsbite.in')}>
                    <Text style={[styles.paragraph, { color: '#0EA5E9', textDecorationLine: 'underline' }]}>
                        Website: www.newsbite.in
                    </Text>
                </TouchableOpacity>

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
    logoContainer: {
        alignItems: 'center',
        marginVertical: 32,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
    },
    appName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        color: '#6B7280',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 24,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 12,
    },
});
