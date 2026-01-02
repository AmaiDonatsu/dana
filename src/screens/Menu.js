import React from 'react'
import { View, Text, Button } from 'react-native'

const Menu = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Menu</Text>
            <View>
                <Text>GrandMastersTemple</Text>
                <Button
                    title="Go to Grand Masters Temple"
                    onPress={() => navigation.navigate('GrandMastersTemple',)}
                />
            </View>
        </View>
    )
}

export default Menu