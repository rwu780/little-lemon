import * as React from 'react';
import {Image, Pressable, SafeAreaView, Text, TextInput, View} from 'react-native'

import { COLORS } from '../assets/color';
import font from '../assets/font';
import * as db from '../data/storage'


const Onboarding = () => {

    const logoImage = require('../assets/images/Logo.png')

    const [firstName, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [isValidInput, setIsValidInputs] = React.useState(false);

    const { signIn } = React.useContext(db.getContext())

    const login = () => {
        signIn({firstName, email})        
    }

    React.useEffect(() => {
        if (email.length === 0 || firstName.length === 0) {
            setIsValidInputs(false)
        } else {
            setIsValidInputs(true)
        }
    }, [email, firstName])
    
    return(
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light_grey}}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 8
                
            }}>
                <Image source={logoImage} style={{ width: '80%', height: undefined, aspectRatio: 185/40 }}/>
            </View>
            <View style={{
                backgroundColor: COLORS.dark_grey,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 50,
                paddingBottom: 100
            }}>
                <Text style={[font.headingText, {marginBottom: 100, color: COLORS.dark_green}]}>Let us get to know you</Text>
                <Text style={[font.headingText, {color: COLORS.dark_green} ]}>First Name</Text>
                <TextInput style={{
                    borderColor: COLORS.dark_green,
                    height: 40,
                    width: '80%',
                    borderWidth: 2,
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 10,
                    marginTop: 15
                }} onChangeText={setFirstName} />
                <Text style={[font.headingText, {color: COLORS.dark_green, marginTop: 15}]}>Email</Text>
                <TextInput style={{
                    borderColor: COLORS.dark_green,
                    height: 40,
                    width: '80%',
                    borderWidth: 2,
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 10,
                    marginTop: 15,
                    
                }} onChangeText={setEmail} />
            </View>
            <View style={{
                alignItems: 'flex-end',
                paddingTop: 50,
                paddingBottom: 30,
            }}>
                <Pressable style={{
                    backgroundColor: COLORS.dark_grey ,
                    paddingHorizontal: 30,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginEnd: 10,

                }} onPress={login} disabled={!isValidInput}>
                    <Text style={[font.headingText, {color: (isValidInput ? COLORS.dark_green : COLORS.light_grey)}]}>Next</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );

}

export default Onboarding;
