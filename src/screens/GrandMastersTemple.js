import React from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'

const GrandMastersTemple = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Memory Master</Text>
                <Button
                    title="Play"
                    onPress={() => navigation.navigate('WorkingMemory')}
                />
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
    title: {
        color: '#ffffff',
        fontSize: 24,
        marginBottom: 20,
    }
})

export default GrandMastersTemple