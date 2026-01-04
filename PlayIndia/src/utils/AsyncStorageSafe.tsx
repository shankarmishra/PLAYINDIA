import AsyncStorage from '@react-native-async-storage/async-storage';

// Safe wrapper for AsyncStorage
// In a real scenario, this could handle more complex error logging or fallbacks

const AsyncStorageSafe = {
    getItem: async (key: string) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('AsyncStorage error:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('AsyncStorage error:', error);
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('AsyncStorage error:', error);
        }
    },
};

export default AsyncStorageSafe;
