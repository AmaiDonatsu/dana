import React from 'react'
import { View, StyleSheet, Text, Button, Image } from 'react-native'
import NavigationCards from '../components/ui/NavigationCards'

const GrandMastersTemple = ({ navigation }) => {
    const screenNavInfo = [
        {
            id: 1,
            name: 'Working Memory',
            screen: 'WorkingMemory',
            image: require('../../assets/memory-master.webp'),
        },
    ]
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grand Master's Temple</Text>
            <View style={styles.content}>
                <NavigationCards screenNavInfo={screenNavInfo} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050507',
        alignItems: 'center', // Center title basically
        paddingTop: 50,
    },
    content: {
        flex: 1, // Take remaining space for the list
        width: '100%',
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    }
})

export default GrandMastersTemple