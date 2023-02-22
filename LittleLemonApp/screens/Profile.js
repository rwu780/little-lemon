import * as React from 'react';
import { Text, View, ScrollView } from 'react-native'

export default function Profile() {
    return (
        <ScrollView style={{
            flex: 1,
        }} contentContainerStyle={{
            alignItems: 'flex-start'
        }}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItem: 'center'
            }}>
                <Text>Profile Page</Text>
            </View>




        </ScrollView>
    )
}