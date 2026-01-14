import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const ModalTextAndOk = ({ text, onAcept, visible }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.messageText}>{text}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onAcept()}
                    >
                        <Text style={styles.buttonText}>ACEPTAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    modalBox: {
        width: '100%',
        maxWidth: 300,
        backgroundColor: '#0D0D0D',
        borderWidth: 2,
        borderColor: '#D4AF37', // Oro Imperial
        padding: 30,
        alignItems: 'center',
    },
    messageText: {
        color: '#D4AF37',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'serif',
        lineHeight: 28,
        marginBottom: 30,
    },
    button: {
        borderWidth: 1,
        borderColor: '#00FF9D', // Verde Jade
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: 'rgba(0, 255, 157, 0.05)',
    },
    buttonText: {
        color: '#00FF9D',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 2,
    }
});

export default ModalTextAndOk;