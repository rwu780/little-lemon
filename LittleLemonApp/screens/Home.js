import * as React from 'react'
import { View, Text, FlatList, ActivityIndicator, Image, Pressable, StyleSheet, ScrollView, TextInput, Keyboard } from 'react-native'
import font from '../assets/font';
import { COLORS } from '../assets/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import { createTable, getMenuItems, saveMenuItems, fetchFilterItems } from '../data/database';


const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ['starters', 'mains', 'desserts', 'drinks']

const MenuItem = ({ item }) => {

    const getImageURL = (name) => {
        return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${name}?raw=true`
    }

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: 8,
            paddingVertical: 12,
            backgroundColor: 'white',
            flexDirection: 'row',
            paddingBottom: 20
        }}>
            <View style={{
                flex: 1,
                paddingTop: 12,
                paddingRight: 8,
                paddingLeft: 8
            }}>
                <Text style={[font.headingText]}>{item.name}</Text>
                <Text style={[
                    font.paragraphText,
                    {
                        color: COLORS.dark_green,
                        marginTop: 12,

                    }
                ]} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={[font.cardTitle, {
                    color: COLORS.dark_green,
                    marginTop: 12

                }]}>
                    ${item.price}
                </Text>
            </View>
            <View style={{
                justifyContent: 'flex-end',
                marginRight: 8
            }}>
                <Image
                    source={{ uri: getImageURL(item.image) }}
                    style={{
                        width: 100,
                        height: 100
                    }}
                />
            </View>
        </View>
    )
}

const Separator = () => <View style={{ borderBottomWidth: 1, borderColor: COLORS.highlight_grey }} />

const HorizontalSpacer = () => <View style={{ width: 20 }} />

export default function Home() {

    const [filters, setFilters] = React.useState(
        sections.map(() => false)
    );

    const [query, updateQuery] = React.useState('')

    const updateFilter = (index) => {
        const newStates = [...filters];
        newStates[index] = !filters[index];
        setFilters(newStates)
    }

    const heroImage = require('../assets/images/HeroImage.png')

    const [isLoading, setLoading] = React.useState(false);
    const [menuData, setMenuData] = React.useState([])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch(API_URL);
            const json = await response.json();
            console.log("abc", json)
            return json.menu

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return []
    }

    const cacheData = async () => {
        try {
            await createTable();

            let menuItems = await getMenuItems();

            if (!menuItems.length) {
                const latestMenuItems = await fetchData();
                saveMenuItems(latestMenuItems)
            }

            menuItems = await getMenuItems();
            setMenuData(menuItems)
        } catch (e) {
            console.log(e)
        }
    }

    const queryMenuItems = async () => {
        const activeCategories = sections.filter((s, i) => {
            return filters[i];
        })

        if (activeCategories.length !== 0 || query.length !== 0) {
            const menuItems = await fetchFilterItems(
                query,
                activeCategories
            )
            setMenuData(menuItems)
        }
    }

    React.useEffect(() => {
        cacheData();
    }, [])

    React.useEffect(() => {
        queryMenuItems();

    }, [filters, query])

    return (
        <View style={{
            flex: 1
        }}>
            <View style={{
                backgroundColor: COLORS.dark_green,
                padding: 15,
            }}>
                <Text style={[
                    font.titleText,
                    { color: COLORS.light_yellow }
                ]}>
                    Little Lemon
                </Text>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View style={{
                        flex: 1,
                        paddingRight: 12

                    }}>
                        <Text style={[font.subTitleText, { color: 'white' }]}>Chicago</Text>
                        <Text style={[font.paragraphText, {
                            color: 'white',
                            marginTop: 30,
                            paddingBottom: 12
                        }]}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    </View>
                    <View style={{
                        justifyContent: 'flex-start',
                        paddingTop: 20
                    }}>
                        <Image source={heroImage} style={{
                            width: 150,
                            height: 150,
                            borderRadius: 8,

                        }} />
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    borderWidth: 3,
                    borderColor: COLORS.dark_green,
                    overflow: 'hidden'

                }}>
                    <Pressable style={{
                        backgroundColor: COLORS.highlight_grey,
                        padding: 8,

                    }}>
                        <FontAwesome name="search" size={24} color="black" />
                    </Pressable>
                    <TextInput
                        value={query}
                        onChangeText={newText => updateQuery(newText)}
                        style={{
                            flex: 1,
                            height: 40,
                            padding: 10,
                            fontSize: 16,
                            backgroundColor: COLORS.highlight_grey
                        }} />
                </View>
            </View>
            <View style={{
                paddingTop: 30,
                paddingHorizontal: 12,
                backgroundColor: 'white'
            }}>
                <Text style={[font.sectionTitle]}>
                    Order for delivery
                </Text>

                <ScrollView style={{
                    paddingTop: 20,
                    paddingBottom: 30,
                }}
                    horizontal={true}>
                    <Pressable style={[
                        (filters[0] ? {
                            backgroundColor: COLORS.light_salmon
                        } : {
                            backgroundColor: COLORS.highlight_grey
                        }),
                        homeStyle.orderSectionContainer
                    ]}
                        onPress={() => updateFilter(0)}>
                        <Text style={
                            [homeStyle.orderSectionText, { textTransform: 'capitalize' }]
                        }>
                            {sections[0]}
                        </Text>
                    </Pressable>

                    <HorizontalSpacer />

                    <Pressable style={[
                        (filters[1] ? {
                            backgroundColor: COLORS.light_salmon
                        } : {
                            backgroundColor: COLORS.highlight_grey
                        }),
                        homeStyle.orderSectionContainer
                    ]}
                        onPress={() => updateFilter(1)}
                    >
                        <Text style={
                            [homeStyle.orderSectionText, { textTransform: 'capitalize' }]
                        }>
                            {sections[1]}
                        </Text>
                    </Pressable>

                    <HorizontalSpacer />

                    <Pressable style={[
                        (filters[2] ? {
                            backgroundColor: COLORS.light_salmon
                        } : {
                            backgroundColor: COLORS.highlight_grey
                        }),
                        homeStyle.orderSectionContainer
                    ]}
                        onPress={() => updateFilter(2)}
                    >
                        <Text style={[homeStyle.orderSectionText, { textTransform: 'capitalize' }]}>
                            {sections[2]}
                        </Text>
                    </Pressable>

                    <HorizontalSpacer />

                    <Pressable
                        onPress={() => updateFilter(3)}
                        style={[(filters[3] ? {
                            backgroundColor: COLORS.light_salmon
                        } : {
                            backgroundColor: COLORS.highlight_grey
                        }),
                        homeStyle.orderSectionContainer]}>
                        <Text style={[homeStyle.orderSectionText, { textTransform: 'capitalize' }]}>
                            {sections[3]}
                        </Text>
                    </Pressable>
                </ScrollView>
                <Separator />

            </View>
            <View
                style={{
                    flex: 1,
                }}>
                {isLoading
                    ? (
                        <ActivityIndicator />
                    )
                    : (
                        <FlatList
                            data={menuData}
                            renderItem={
                                ({ item }) => <MenuItem item={item} />
                            }
                            ItemSeparatorComponent={
                                () => <Separator />
                            }
                        />
                    )
                }
            </View>
        </View>
    )
}

const homeStyle = StyleSheet.create({
    orderSectionContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 15,

    },
    orderSectionContainerUnSelected: [
        {
            backgroundColor: COLORS.highlight_grey,
        }
    ],

    orderSectionContainerSelected: [
        {
            backgroundColor: COLORS.highlight_grey,
        }
    ],
    orderSectionText: [
        font.ctaText,
        {
            color: COLORS.dark_green
        }]
})