import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  currentLocation: LocationCoords | null;
  currentAddress: string;
  locationLoading: boolean;
  permissionGranted: boolean;
  refreshLocation: () => Promise<void>;
  getCurrentLocation: () => Promise<LocationCoords | null>;
  isInitialized: boolean;
  requestLocationPermission: () => Promise<boolean>;
}

let navigationRef: any = null;

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// TODO: Move this to environment variables (.env file)
// Use react-native-config or similar
const GOOGLE_MAPS_API_KEY = 'AIzaSyAMa21EOJBWoI76FClNbfSeI9044p6RnQo';

const fetchLocationSafe = (
  onSuccess: (coords: LocationCoords) => void,
  onError: (error: any) => void
) => {
  if (!Geolocation || typeof Geolocation.getCurrentPosition !== 'function') {
    console.log('Geolocation not available');
    onError('Geolocation not available');
    return;
  }

  // Add timeout mechanism
  const timeoutId = setTimeout(() => {
    console.log('📍 Geolocation timeout after 15 seconds');
    onError('Location request timed out');
  }, 15000);

  try {
    console.log('📍 Starting geolocation request...');
    Geolocation.getCurrentPosition(
      (position) => {
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
        console.log('📍 Geolocation SUCCESS callback called');
        console.log('📍 Position received:', position);
        try {
          if (!position || !position.coords) {
            console.log('📍 No coordinates in position');
            onError('No coordinates');
            return;
          }
          console.log('📍 Coordinates:', position.coords.latitude, position.coords.longitude);
          onSuccess({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } catch (e) {
          console.log('📍 Position processing error:', e);
          onError(e);
        }
      },
      (error) => {
        // Clear timeout since we got an error
        clearTimeout(timeoutId);
        
        console.log('📍 Geolocation ERROR callback called');
        console.log('📍 GPS ERROR:', error.code, error.message);
        onError(error);
      },
      {
        enableHighAccuracy: true, // Changed to true for better accuracy
        timeout: 15000,
        maximumAge: 5000, // Reduced maximum age for fresher data
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
    console.log('📍 Geolocation request sent');
  } catch (err) {
    clearTimeout(timeoutId);
    console.log('📍 Geolocation exception:', err);
    onError(err);
  }
};

const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log('🗺️ Geocoding request:', `${lat},${lng}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('🗺️ Geocoding response status:', data.status);
    
    if (data.status === 'OK' && data.results && data.results[0]) {
      const address = data.results[0].formatted_address;
      console.log('🗺️ Full address:', address);
      const parts = address.split(', ');
      const shortAddress = parts.length >= 2 ? parts[0] + ', ' + parts[1] : address;
      console.log('🗺️ Short address:', shortAddress);
      return shortAddress;
    } else if (data.status !== 'OK') {
      console.log('🗺️ Geocoding API error:', data.status, data.error_message || '');
    }
    return 'Current Location';
  } catch (error) {
    console.log('🗺️ Geocoding fetch error:', error);
    return 'Current Location';
  }
};

export const LocationProvider: React.FC<{ children: ReactNode; navigation?: any }> = ({ children, navigation }) => {
  // Store navigation reference
  useEffect(() => {
    if (navigation) {
      navigationRef = navigation;
    }
  }, [navigation]);
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Use ref to prevent race conditions
  const isFetchingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchLocationOnce = useCallback(() => {
    // Prevent multiple simultaneous location fetches
    if (isFetchingRef.current) {
      console.log('Location already loading, skipping...');
      return;
    }
    
    isFetchingRef.current = true;
    setLocationLoading(true);
    
    // Try primary method first
    fetchLocationSafe(
      async (coords) => {
        if (!isMountedRef.current) return;
        setCurrentLocation(coords);
        const address = await getAddressFromCoords(coords.latitude, coords.longitude);
        if (!isMountedRef.current) return;
        setCurrentAddress(address);
        setLocationLoading(false);
        isFetchingRef.current = false;
        
        // Auto-navigate to LiveMap screen when location is found
        if (navigationRef) {
          try {
            navigationRef.navigate('LiveMap', { 
              searchRequest: { radius: 5 } 
            });
          } catch (navError) {
            console.log('Navigation error:', navError);
          }
        }
      },
      async (error) => {
        if (!isMountedRef.current) return;
        console.log('Primary location fetch failed:', error);
        
        // Try fallback method - watch position
        try {
          console.log('📍 Trying fallback method - watch position');
          let watchId: number | null = null;
          
          const timeoutId = setTimeout(() => {
            if (watchId !== null) {
              Geolocation.clearWatch(watchId);
            }
            console.log('📍 Fallback method timeout');
            if (isMountedRef.current) {
              setLocationLoading(false);
              isFetchingRef.current = false;
            }
          }, 10000);
          
          watchId = Geolocation.watchPosition(
            async (position) => {
              clearTimeout(timeoutId);
              if (watchId !== null) {
                Geolocation.clearWatch(watchId);
              }
              
              if (!isMountedRef.current) return;
              
              if (position && position.coords) {
                const coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                setCurrentLocation(coords);
                const address = await getAddressFromCoords(coords.latitude, coords.longitude);
                if (!isMountedRef.current) return;
                setCurrentAddress(address);
                console.log('📍 Fallback method SUCCESS');
                
                // Auto-navigate to LiveMap screen when location is found
                if (navigationRef) {
                  try {
                    navigationRef.navigate('LiveMap', { 
                      searchRequest: { radius: 5 } 
                    });
                  } catch (navError) {
                    console.log('Navigation error:', navError);
                  }
                }
              }
              if (isMountedRef.current) {
                setLocationLoading(false);
                isFetchingRef.current = false;
              }
            },
            (error) => {
              clearTimeout(timeoutId);
              if (watchId !== null) {
                Geolocation.clearWatch(watchId);
              }
              console.log('📍 Fallback method ERROR:', error);
              if (isMountedRef.current) {
                setLocationLoading(false);
                isFetchingRef.current = false;
              }
            },
            {
              enableHighAccuracy: true,
              distanceFilter: 10,
            }
          );
        } catch (fallbackError) {
          console.log('📍 Fallback method failed:', fallbackError);
          setLocationLoading(false);
          isFetchingRef.current = false;
        }
      }
    );
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      setPermissionGranted(true);
      return true;
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted) {
        setPermissionGranted(true);
        return true;
      }

      if (typeof PermissionsAndroid.request !== 'function') {
        console.log('PermissionsAndroid.request not available');
        return false;
      }

      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Enable Location',
          message: 'We need your location to find nearby players.',
          buttonNeutral: 'Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Enable',
        }
      );

      const isGranted = result === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionGranted(isGranted);
      return isGranted;
    } catch (error) {
      console.log('Permission request error:', error);
      return false;
    }
  }, []);

  const initLocation = useCallback(async () => {
    try {
      const granted = await requestLocationPermission();
      if (granted) {
        fetchLocationOnce();
      }
    } catch (err) {
      console.log('Init location error:', err);
    } finally {
      setIsInitialized(true);
    }
  }, [requestLocationPermission, fetchLocationOnce]);

  useEffect(() => {
    // DON'T auto-request permission on app startup - wait for user to tap location button
    // This prevents app crash on startup
    setIsInitialized(true);
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      console.log('🔄 Refreshing location...');
      const granted = await requestLocationPermission();
      console.log('_permission granted:', granted);
      if (granted) {
        fetchLocationOnce();
      } else {
        console.log('❌ Location permission denied');
        Alert.alert(
          'Permission Required', 
          'Please enable location permission in app settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // This would require linking to app settings
              console.log('User should manually enable location in settings');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('❌ Location refresh error:', error);
      Alert.alert(
        'Location Error', 
        'Failed to get your location. Please make sure:\n\n' +
        '• Location services are enabled on your device\n' +
        '• You have granted location permission\n' +
        '• You have a clear view of the sky (for GPS)\n\n' +
        'Try again or check your device settings.',
        [
          { text: 'Try Again', onPress: () => refreshLocation() },
          { text: 'OK', style: 'cancel' }
        ]
      );
    }
  }, [requestLocationPermission, fetchLocationOnce]);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoords | null> => {
    return new Promise((resolve) => {
      if (!permissionGranted) {
        resolve(null);
        return;
      }
      
      fetchLocationSafe(
        (coords) => resolve(coords),
        () => resolve(null)
      );
    });
  }, [permissionGranted]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        currentAddress,
        locationLoading,
        permissionGranted,
        refreshLocation,
        getCurrentLocation,
        isInitialized,
        requestLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export default LocationContext;