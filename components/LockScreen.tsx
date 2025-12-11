import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSecurity } from '@/context/SecurityContext'; // Adjust import path if needed
import { useTheme } from '@/context/ThemeContext';
import { Lock } from 'lucide-react-native';

export function LockScreen() {
    const { authenticate } = useSecurity();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Lock size={64} color={colors.tint} />
            <Text style={[styles.title, { color: colors.text }]}>Newsbite Locked</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
                Authentication required to access your news
            </Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={() => authenticate()}
            >
                <Text style={styles.buttonText}>Unlock</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 25,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
