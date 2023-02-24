import * as React from 'react';
import { Text, View, ScrollView, Pressable, SafeAreaView, TextInput, StyleSheet, Alert, Image } from 'react-native'
import * as db from '../data/storage';
import { COLORS } from '../assets/color';
import font from '../assets/font';
import Checkbox from 'expo-checkbox';

import * as ImagePicker from 'expo-image-picker';
import { validateEmail } from './utils';

export default function Profile({navigation}) {

    const { signOut, update } = React.useContext(db.getContext())

    const [profile, setProfile] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        order_statuses: false,
        password_changes: false,
        special_offers: false,
        newsletter: false,
        image: '',
    });

    const updateProfile = (key, value) => {
        setProfile(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }

    const updateCheckbox = (key) => {
        setProfile(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }))
    };

    const logOut = () => {
        signOut();
    }

    const saveProfile = () => {
        if (profile.firstName !== "" && profile.lastName !== "" && profile.email !== "" && profile.phoneNumber !== "" && validateEmail(profile.email)) {
            db.saveProfile(profile);
            Alert.alert(
                '',
                'Your information is updated',
                [
                    {
                        text: 'OK', onPress: () => {
                            update(profile)
                            navigation.goBack()
                            
                        }
                    }
                ]
            )
        } else {
            Alert.alert('', 'You did not fill out the require information')
        }
    }

    const restoreProfile = async () => {
        const storedProfile = await db.getProfile();

        setProfile(storedProfile)

    }

    React.useEffect(() => {
        const loadProfile = async () => {
            let storedProfile = await db.getProfile();

            const mergeProfile = Object.assign({}, profile, storedProfile)
            setProfile(mergeProfile)
        }

        loadProfile();
    }, [])

    const avatarImage = require('../assets/images/Profile.png');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            updateProfile("image", result.assets[0].uri);
        }
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
            borderColor: COLORS.dark_grey,
            borderWidth: 2,
            borderRadius: 10,
            margin: 2,
        }}>
            <ScrollView style={{
                flex: 1,
            }} contentContainerStyle={{
                alignItems: 'flex-start',
                paddingHorizontal: 10
            }}>
                <View style={{
                    paddingTop: 20,
                }}>
                    <Text style={[font.headingText, { "color": COLORS.dark_green }]} >Personal Information</Text>
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Text style={[font.highlightText, { color: COLORS.dark_green }]}>Avatar</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={profile.image === '' ? avatarImage : { uri: profile.image }} style={{
                            width: 100,
                            height: 100
                        }} />
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            marginStart: 20
                        }}>
                            <Pressable style={{
                                backgroundColor: COLORS.dark_green,
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                alignSelf: 'center',
                            }}
                                onPress={pickImage}
                            >
                                <Text style={[font.ctaText, { color: 'white' }]}>Change</Text>
                            </Pressable>

                            <Pressable style={{
                                borderWidth: 1,
                                borderColor: COLORS.dark_green,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                marginStart: 20,
                                borderRadius: 4,
                                alignSelf: 'center'
                            }} onPress={() => updateProfile('image', '')}>
                                <Text style={[font.ctaText, { color: COLORS.dark_green }]}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    marginTop: 20
                }}>
                    <Text style={[font.highlightText, { color: COLORS.dark_green }]}>First name*</Text>
                    <TextInput style={profileStyles.textInputStyle}
                        value={profile.firstName}
                        onChangeText={
                            value => { updateProfile('firstName', value) }
                        } />
                </View>

                <View style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    marginTop: 20
                }}>
                    <Text style={[font.highlightText, { color: COLORS.dark_green }]}>Last name*</Text>
                    <TextInput style={profileStyles.textInputStyle} value={profile.lastName} onChangeText={
                        value => { updateProfile('lastName', value) }
                    } />
                </View>

                <View style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    marginTop: 20
                }}>
                    <Text style={[font.highlightText, { color: COLORS.dark_green }]}>Email*</Text>
                    <TextInput style={profileStyles.textInputStyle}
                        value={profile.email}
                        onChangeText={
                            value => { updateProfile('email', value) }
                        } />
                </View>

                <View style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    marginTop: 20
                }}>
                    <Text style={[font.highlightText, { color: COLORS.dark_green }]}>Phone number*</Text>
                    <TextInput style={profileStyles.textInputStyle} value={profile.phoneNumber} keyboardType='numeric' onChangeText={
                        value => { updateProfile('phoneNumber', value.replace(/[^0-9]/g, '')) }
                    } />
                </View>

                <View style={{
                    marginTop: 20
                }}>
                    <Text style={[font.cardTitle, { color: COLORS.dark_green }]}>Email notifications</Text>
                    <View style={profileStyles.checkboxContainer}>
                        <Checkbox value={
                            profile.order_statuses
                        }
                            onValueChange={() => updateCheckbox('order_statuses')} />
                        <Text style={[font.highlightText, profileStyles.checkboxText]}>Order statuses</Text>
                    </View>

                    <View style={profileStyles.checkboxContainer}>
                        <Checkbox value={
                            profile.password_changes
                        }
                            onValueChange={() => updateCheckbox('password_changes')}
                        />
                        <Text style={[font.highlightText, profileStyles.checkboxText]}>Password changes</Text>
                    </View>
                    <View style={profileStyles.checkboxContainer}>
                        <Checkbox value={
                            profile.special_offers
                        }
                            onValueChange={() => updateCheckbox('special_offers')}
                        />
                        <Text style={[font.highlightText, profileStyles.checkboxText]}>Special offers</Text>
                    </View>
                    <View style={profileStyles.checkboxContainer}>
                        <Checkbox value={
                            profile.newsletter
                        }
                            onValueChange={() => updateCheckbox('newsletter')}
                        />
                        <Text style={[font.highlightText, profileStyles.checkboxText]}>Newsletter</Text>
                    </View>
                </View>

                <View style={{
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    marginTop: 30
                }} >
                    <Pressable
                        style={{
                            backgroundColor: COLORS.light_yellow,
                            borderRadius: 10,
                            height: 40,
                            justifyContent: 'center',
                            borderColor: COLORS.bright_orange
                        }}
                        onPress={() => {
                            logOut()
                        }}>
                        <Text style={[font.ctaText, {
                            textAlign: 'center',
                        }]}>Log Out</Text>
                    </Pressable>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignSelf: 'stretch',
                    marginTop: 50,
                    paddingBottom: 30
                }}>
                    <Pressable style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderWidth: 1,
                        borderColor: COLORS.dark_green,
                        borderRadius: 8,
                    }} onPress={restoreProfile}>
                        <Text style={[font.ctaText, {
                            color: COLORS.dark_green

                        }]}>Discard changes</Text>
                    </Pressable>

                    <Pressable style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: COLORS.dark_green,
                        borderRadius: 8,
                        marginStart: 20,

                    }}
                        onPress={saveProfile}>
                        <Text style={[font.ctaText, {
                            color: 'white'

                        }]} >Save changes</Text>
                    </Pressable>

                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const profileStyles = StyleSheet.create({
    textInputStyle: {
        borderWidth: 1,
        height: 40,
        borderRadius: 8,
        fontSize: 16,
        padding: 10,
        borderColor: COLORS.dark_green,
        marginTop: 5
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    checkboxText: {
        color: COLORS.dark_green,
        marginStart: 8
    }
})