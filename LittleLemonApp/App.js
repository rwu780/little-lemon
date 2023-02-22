import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import Onboarding from './screens/Onboarding'
import Profile from './screens/Profile';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react'

import * as db from './data/storage';

const Stack = createNativeStackNavigator();
const AuthContext = db.getContext();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_STATE':
          return {
            ...prevState,
            isOnboardingCompleted: action.isOnboardingCompleted
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            isOnboardingCompleted: false
          };
      }
    },
    {
      isSignout: false,
      isOnboardingCompleted: false
    }
  )

  React.useEffect(() => {
    const bootsAsync = async () => {
      let isLogin;

      try {
        isLogin = await db.getData('login');
      } catch (e) {
        console.log(e)
      }
      console.log("abc", isLogin)
      isLogin = (!isLogin.length) ? true : false;

      dispatch({ type: 'RESTORE_STATE', isOnboardingCompleted: isLogin });
    };

    bootsAsync();

  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: 'SIGN_IN', isOnboardingCompleted: true })
      },
      signOut: () => {
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  )
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          {!state.isOnboardingCompleted
            ? (

              <Stack.Screen name="Profile" component={Profile} options={{
                headerTitle: (props) => <LogoTitle />
              }} />

            )
            : (<Stack.Screen name='Onboarding' component={Onboarding} />)
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const LogoTitle = () => {
  const logoImage = require('./assets/images/Logo.png')
  return (
    <Image source={logoImage} style={{ width: '60%', height: undefined, aspectRatio: 185 / 40 }} />
  )
}

