import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext } from 'react';

const AuthContext = createContext();

export function getContext() {
    return AuthContext;
}


export async function saveData(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error.message);
    }
}

export async function getData(key) {
    let data = ''
    try {
        data = await AsyncStorage.getItem(key) || ''
    } catch (error) {
        console.log(error.message)
    }
    
    return data;
}

export async function userLogin() {
    await saveData('login', true);
}

export async function isUserLogin() {
    let isLogin = await getData('login');
    if (!isLogin.length) {
        return false;
    }
    isLogin = JSON.parse(isLogin);
    if (isLogin) {
        return true
    } else {
        return false
    }
}

export async function saveProfile(profile) {
    console.log("db save", profile)
    await saveData('profile', profile)
}

export async function getProfile() {
    let storeProfile = await getData('profile');
    return JSON.parse(storeProfile)
}

export async function clearStorage() {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.log(e.message);

    }
}
