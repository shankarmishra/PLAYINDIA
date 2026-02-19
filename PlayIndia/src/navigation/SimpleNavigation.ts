import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

type NavigationType = StackNavigationProp<RootStackParamList>;

export const createSimpleNavigation = (navigateCallback: (screen: string) => void): NavigationType => {
  return {
    navigate: (screen: any, params?: any) => {
      if (typeof screen === 'string') {
        navigateCallback(screen);
      }
    },
    goBack: () => {
      // Handle back navigation
    },
    dispatch: (action: any) => {
      if (action.type === 'RESET') {
        const routeName = action.payload?.routes?.[0]?.name;
        if (routeName) {
          navigateCallback(routeName);
        }
      }
    },
    reset: (state: any) => {},
    isFocused: () => true,
    canGoBack: () => true,
    getId: () => '',
    getParent: () => undefined,
    getState: () => ({ 
      index: 0, 
      routes: [], 
      key: 'stack',
      routeNames: [],
      type: 'stack',
      stale: false
    }),
    addListener: () => () => {},
    removeListener: () => {},
    setParams: () => {},
    setOptions: () => {},
  } as unknown as NavigationType;
};