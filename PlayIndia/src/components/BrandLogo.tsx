import React from 'react';
import { Image, StyleSheet, View, ViewStyle, Text } from 'react-native';

interface BrandLogoProps {
    style?: ViewStyle;
    size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ style, size = 40 }) => {
    // Try to load the logo, with fallback to text
    let logoSource;
    try {
        logoSource = require('../assets/PLAYINDIA.png');
    } catch (error) {
        logoSource = null;
    }

    if (logoSource) {
        return (
            <View style={[styles.container, style]}>
                <Image
                    source={logoSource}
                    style={[styles.logoImage, { width: size, height: size }]}
                    resizeMode="contain"
                />
            </View>
        );
    }

    // Fallback to text logo if image not found
    return (
        <View style={[styles.container, styles.fallbackContainer, style]}>
            <View style={[styles.fallbackLogo, { width: size, height: size }]}>
                <Text style={[styles.fallbackText, { fontSize: size * 0.3 }]}>PI</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        borderRadius: 8,
    },
    fallbackContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fallbackLogo: {
        backgroundColor: '#0891B2',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0891B2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    fallbackText: {
        color: '#FFFFFF',
        fontWeight: '900',
        letterSpacing: 1,
    },
});

export default BrandLogo;
