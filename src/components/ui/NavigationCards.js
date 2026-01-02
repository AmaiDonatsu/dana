import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 3; // 2 columns mostly

const NavigationCards = ({ screenNavInfo }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {screenNavInfo && Array.isArray(screenNavInfo) && screenNavInfo.length > 0 ? (
                <FlatList
                    data={screenNavInfo}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate(item.screen)}
                            activeOpacity={0.8}
                        >
                            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />

            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No screens found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    listContent: {
        paddingHorizontal: CARD_MARGIN,
        paddingBottom: 20,
    },
    card: {
        width: CARD_WIDTH,
        margin: CARD_MARGIN,
        backgroundColor: '#1E1E24', // Dark card bg
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: 120,
    },
    cardContent: {
        padding: 12,
        alignItems: 'center',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    }
})

export default NavigationCards;
