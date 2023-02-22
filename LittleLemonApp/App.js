import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import Onboarding from './screens/Onboarding'
import Profile from './screens/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react'

import * as db from './data/storage';

const Stack = createNativeStackNavigator();


export default function App() {
  const [isOnboardingCompleted, setOnboardingCompleted] = React.useState(false)

  React.useEffect(() => {
    (async () => {
      try{
        let isLogin = await db.getData('login');
        if (!isLogin.length) {
          setOnboardingCompleted(true)
        }
      } catch (e) {
        console.log(e)
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        {isOnboardingCompleted
        ? (
          <Stack.Screen name="Profile" component={Profile} options={{
            headerTitle: (props) => <LogoTitle />
          }} />
          )
        : (<Stack.Screen name='Onboarding' component={Onboarding} />)
        }
        
      </Stack.Navigator>
      </NavigationContainer>
  );
}

const LogoTitle = () => {
  const logoImage = require('./assets/images/Logo.png')
  return (
    <Image source={logoImage} style={{ width: '60%', height: undefined, aspectRatio: 185/40 }}/>
  )
}

