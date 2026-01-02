import React from 'react'
import { View, StyleSheet, Text, Button, Image } from 'react-native'
import NavigationCards from '../components/ui/NavigationCards'

const GrandMastersTemple = ({ navigation }) => {
    const screenNavInfo = [
        {
            name: 'Working Memory',
            screen: 'WorkingMemory',
            image: require('../../assets/memory-master.webp'),
        },
    ]
    return (
        <View style={styles.container}>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        marginBottom: 20,
    }
})

export default GrandMastersTemple