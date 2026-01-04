import React from 'react';
import { View, ViewProps } from 'react-native';

// Fallback to View if react-native-linear-gradient is not available
// This prevents the app from crashing if the library isn't installed yet

interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
}

const LinearGradientFallback: React.FC<LinearGradientProps> = ({ children, style, colors, ...props }) => {
    return (
        <View style={[style, { backgroundColor: colors[0] }]} {...props}>
            {children}
        </View>
    );
};

export default LinearGradientFallback;
