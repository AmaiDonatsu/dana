import React from "react";
import { View, Text, FlatList, Button, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavigationCards = ({ screenNavInfo }) => {
    const navigation = useNavigation();

    return (
        <View>
            {screenNavInfo && Array.isArray(screenNavInfo) && screenNavInfo.length > 0 ? (
                <FlatList
                    data={screenNavInfo}
                    renderItem={({ item }) => (
                        <View>
                            <Image source={item.image} style={styles.image} />
                            <Button
                                title={item.name}
                                onPress={() => navigation.navigate(item.screen)}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item.name}
                />

            ) : (
                <Text>No screens found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
    },
})

export default NavigationCards;
