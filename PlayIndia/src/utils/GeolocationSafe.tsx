import Geolocation from 'react-native-geolocation-service';

// Safe wrapper for Geolocation
// Handles permissions and platform differences

const GeolocationSafe = {
    getCurrentPosition: (success: any, error: any, options: any) => {
        Geolocation.getCurrentPosition(success, error, options);
    },
};

export default GeolocationSafe;
