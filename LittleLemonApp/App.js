import { Image, Pressable } from 'react-native';
import Onboarding from './screens/Onboarding'
import Profile from './screens/Profile';
import Home from './screens/Home'
import { NavigationContainer, useIsFocused, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react'

import * as db from './data/storage';
import { COLORS } from './assets/color';

const Stack = createNativeStackNavigator();
const AuthContext = db.getContext();

export default function App() {

  const [profile, setProfile] = React.useState({});

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
        case 'PROFILE_UPDATE':
          return {
            ...prevState,
            isSignout: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            isOnboardingCompleted: action.isOnboardingCompleted
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
        isLogin = await db.isUserLogin();

        if (isLogin) {
          let storedProfile = await db.getProfile();
          setProfile(storedProfile);
        }
      } catch (e) {
        console.log(e)
      }

      dispatch({ type: 'RESTORE_STATE', isOnboardingCompleted: isLogin });
    };

    bootsAsync();

  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: 'SIGN_IN', isOnboardingCompleted: true })
        await db.saveProfile({
          firstName: data.firstName,
          email: data.email
        })
      },
      signOut: async () => {
        await db.clearStorage();
        dispatch({ type: 'SIGN_OUT', isOnboardingCompleted: false });

      },
      update: async (data) => {
        setProfile(data)
        dispatch({type: 'PROFILE_UPDATE', isOnboardingCompleted: true})
      }
    }),
    []
  )

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          {state.isOnboardingCompleted
            ? (
              <>
                <Stack.Screen name='Home' component={Home} options={{
                  headerTitle: (props) => <LogoTitle />,
                  headerRight: () => <AvatarLogo profileImage={profile.image} />
                }} />
                <Stack.Screen name="Profile" component={Profile} options={{
                  headerTitle: (props) => <LogoTitle />
                }} />
              </>

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


  const navigation = useNavigation();

  return (
    <Image source={logoImage} style={{ width: '60%', height: undefined, aspectRatio: 185 / 40 }} />
  )
}

const AvatarLogo = ({profileImage}) => {

  const avatarImage = require('./assets/images/Profile.png')
  const avatarImageSpec = 40;

  const navigation = useNavigation();

  return (
    <Pressable onPress={
      () => navigation.navigate('Profile')
    }>
      <Image source={(profileImage !== "") ? { uri: profileImage } : avatarImage} style={{
        width: avatarImageSpec,
        height: avatarImageSpec,
        borderRadius: avatarImageSpec / 2,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: COLORS.dark_green
      }} />
    </Pressable>
  )
}

