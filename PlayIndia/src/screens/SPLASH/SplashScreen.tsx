import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, Image } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('OnboardingOne');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />

      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../assets/PLAYINDIA.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.logoGlow} />
      </View>

      <Text style={styles.title}>PLAYINDIA</Text>
      <Text style={styles.subtitle}>IND'S PREMIER SPORTS NETWORK</Text>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#00E5FF" />
        <Text style={styles.footerText}>CONNECT. PLAY. COMPETE.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderRadius: 80,
    zIndex: 1,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  head: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00B8D4',
    marginBottom: 4,
  },
  body: {
    width: 24,
    height: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#00B8D4',
  },
  ball: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00B8D4',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 15,
    letterSpacing: 2,
  },
});

export default SplashScreen;
