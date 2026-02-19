import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, TextInput, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LoginWelcome'>;

const LoginWelcome = () => {
    const navigation = useNavigation<NavigationProp>();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
            
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Welcome to the Game</Text>
                <Text style={styles.description}>
                    Enter your mobile number to find your squad and start competing.
                </Text>

                <View style={styles.inputSection}>
                    <Text style={styles.label}>MOBILE NUMBER</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.countryPicker}>
                            <Image source={{ uri: 'https://flagcdn.com/w20/in.png' }} style={styles.flag} />
                            <Text style={styles.countryCode}>+91</Text>
                            <Text style={styles.chevron}>▼</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="00000 00000"
                            placeholderTextColor="#94A3B8"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Send Code →</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>Or continue with</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.googleButton}>
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={styles.googleIcon} />
                    <Text style={styles.googleText}>Google</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1B5E20',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#558B2F',
        opacity: 0.9,
        textAlign: 'center',
        marginBottom: 30,
    },
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#558B2F',
        opacity: 0.9,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#C8E6C9',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#C8E6C9',
        paddingRight: 10,
        marginRight: 15,
    },
    flag: {
        width: 24,
        height: 16,
        marginRight: 8,
    },
    countryCode: {
        fontSize: 16,
        color: '#1B5E20',
        marginRight: 5,
    },
    chevron: {
        fontSize: 10,
        color: '#558B2F',
        opacity: 0.6,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#1B5E20',
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: '#4CAF50',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#C8E6C9',
    },
    dividerText: {
        paddingHorizontal: 15,
        fontSize: 12,
        color: '#558B2F',
        opacity: 0.6,
    },
    googleButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#C8E6C9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    googleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1B5E20',
    },
    footerText: {
        fontSize: 12,
        color: '#558B2F',
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 18,
    },
    link: {
        color: '#4CAF50',
    }
});

export default LoginWelcome;
