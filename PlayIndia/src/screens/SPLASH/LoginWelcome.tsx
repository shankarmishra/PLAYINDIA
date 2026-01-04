import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';

const LoginWelcome = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/welcome.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.energyOverlay}>
                    <View style={styles.boltIcon}>
                        <View style={styles.boltPart1} />
                        <View style={styles.boltPart2} />
                    </View>
                </View>
            </View>

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
                            placeholderTextColor="#4A5568"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Main')}
                >
                    <Text style={styles.buttonText}>Send Code →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.devBypass}
                    onPress={() => navigation.navigate('Main')}
                >
                    <Text style={styles.devText}>Testing Bypass (Login as Guest)</Text>
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
        backgroundColor: '#F7FAFC',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: '80%',
        borderRadius: 30,
    },
    energyOverlay: {
        position: 'absolute',
        width: 80,
        height: 80,
        backgroundColor: '#00B8D4',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00B8D4',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    boltIcon: {
        width: 30,
        height: 40,
    },
    boltPart1: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        transform: [{ skewX: '-20deg' }]
    },
    boltPart2: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
        transform: [{ skewX: '-20deg' }],
        marginTop: -5
    },
    contentContainer: {
        flex: 1.5,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0D1B1E',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#4A5568',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#718096',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
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
        color: '#0D1B1E',
        marginRight: 5,
    },
    chevron: {
        fontSize: 10,
        color: '#718096',
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#0D1B1E',
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: '#00B8D4',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    devBypass: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
    },
    devText: {
        color: '#00B8D4',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        paddingHorizontal: 15,
        fontSize: 12,
        color: '#718096',
    },
    googleButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#E2E8F0',
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
        fontWeight: 'bold',
        color: '#4A5568',
    },
    footerText: {
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 18,
    },
    link: {
        color: '#00B8D4',
    }
});

export default LoginWelcome;
