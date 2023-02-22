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

export async function clearStorage() {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.log(e.message);

    }
}
