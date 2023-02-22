import AsyncStorage from '@react-native-async-storage/async-storage';

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