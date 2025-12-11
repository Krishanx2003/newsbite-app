import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AES, enc } from 'crypto-js';
import { Platform } from 'react-native';

const KEY_ALIAS = 'secure_storage_key';

async function getEncryptionKey(): Promise<string> {
    if (Platform.OS === 'web') {
        return 'web_fallback_key_do_not_use_for_sensitive_production_data';
    }

    let key = await SecureStore.getItemAsync(KEY_ALIAS);
    if (!key) {
        // Generate a random key
        key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await SecureStore.setItemAsync(KEY_ALIAS, key);
    }
    return key;
}

export const StorageService = {
    async setItem(key: string, value: any): Promise<void> {
        try {
            const encryptionKey = await getEncryptionKey();
            const jsonValue = JSON.stringify(value);
            const encrypted = AES.encrypt(jsonValue, encryptionKey).toString();
            await AsyncStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('StorageService Set Error:', e);
            throw e;
        }
    },

    async getItem<T>(key: string): Promise<T | null> {
        try {
            const encrypted = await AsyncStorage.getItem(key);
            if (!encrypted) return null;

            const encryptionKey = await getEncryptionKey();

            // Attempt decryption
            try {
                const bytes = AES.decrypt(encrypted, encryptionKey);
                const decrypted = bytes.toString(enc.Utf8);
                // If valid, return parsed
                if (decrypted) return JSON.parse(decrypted) as T;
            } catch (decryptError) {
                // If decryption fails (malformed utf-8 etc), it might be legacy plain JSON
                // Fall through to fallback
            }

            // Fallback: Try parsing raw value as JSON (Legacy Migration)
            try {
                const plain = JSON.parse(encrypted);
                // If successful, maybe we should re-save it encrypted? 
                // For now, just return it. Next write will be encrypted.
                return plain as T;
            } catch (jsonError) {
                // Real corruption or empty
                return null;
            }
        } catch (e) {
            console.error('StorageService Get Error:', e);
            return null;
        }
    },

    async removeItem(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    },

    async clear(): Promise<void> {
        await AsyncStorage.clear();
    }
};
