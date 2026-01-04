import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';

interface BrandLogoProps {
    style?: ViewStyle;
    size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ style, size = 40 }) => {
    return (
        <View style={[styles.container, style]}>
            <Image
                source={require('../assets/PLAYINDIA.png')}
                style={{ width: size, height: size, borderRadius: size / 4 }}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default BrandLogo;
