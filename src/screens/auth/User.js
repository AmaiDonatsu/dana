import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';

const User = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const db = getFirestore();
        const userDocRef = doc(db, 'user', currentUser.uid);

        const unsubscribe = onSnapshot(userDocRef, documentSnapshot => {
            if (documentSnapshot.exists()) {
                const data = documentSnapshot.data();
                console.log("User document exists: ", data);
                setUserData(data);
            } else {
                console.log('User document does not exist');
            }
            setLoading(false);
        }, error => {
            console.error('Error fetching user data:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleLogout = () => {
        signOut(auth);
    };


    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No se pudo cargar la información del perfil.</Text>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: userData.thumbnail || 'https://via.placeholder.com/150' }}
                    style={styles.avatar}
                />
                <Text style={styles.username}>{userData.username || 'Usuario'}</Text>
                <Text style={styles.userId}>ID: {userData.user_id}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Sobre mí</Text>
                <Text style={styles.readmeText}>
                    {userData.readme || 'No hay información disponible.'}
                </Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        backgroundColor: '#ddd',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    userId: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    infoSection: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6C63FF',
        marginBottom: 10,
    },
    readmeText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#dc3545',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#6C63FF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        margin: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dc3545',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#dc3545',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default User;
