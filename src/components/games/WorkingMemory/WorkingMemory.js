import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const ICONS = ['⚛️', '🧬', '🔭', '🪐', '💻', '⚡', '🤖', '🔋', '🚀'];
const INITIAL_MAPPING = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const WorkingMemory = () => {
    // Game State
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [statusText, setStatusText] = useState("SISTEMA INICIALIZADO");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    // isInverseMode removed - now default behavior
    const [nodeMapping, setNodeMapping] = useState([...INITIAL_MAPPING]);
    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [activeNode, setActiveNode] = useState(null); // Index of the currently highlighted slot
    const [shuffleActive, setShuffleActive] = useState(false);
    const [nodeStatus, setNodeStatus] = useState({}); // { slotIndex: 'success' | 'error' | null }
    const soundRef = useRef(null);

    // Audio Logic
    useEffect(() => {
        const playSound = async () => {
            try {
                // Unload any existing sound before loading a new one
                if (soundRef.current) {
                    await soundRef.current.unloadAsync();
                }

                const { sound } = await Audio.Sound.createAsync(
                    require('../../../../assets/audio/muscafondo.mp3'),
                    { isLooping: true, volume: 0.5 }
                );
                soundRef.current = sound;
                await sound.playAsync();
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        };

        playSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.stopAsync();
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    // Constants
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Game Logic
    const startGame = async () => {
        setIsPlaying(true);
        startNextRound(1, 0, []);
    };

    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setSequence([]);
        setPlayerSequence([]);
        setNodeMapping([...INITIAL_MAPPING]);
        setStatusText("SISTEMA LISTO");
        setIsPlaying(false);
        setIsShowingSequence(false);
        setShuffleActive(false);
        setNodeStatus({});
        setActiveNode(null);
    };

    const startNextRound = (currentLevel = level, currentScore = score, resetSeq = null) => {
        const nextIconIdx = Math.floor(Math.random() * 9);
        const newSequence = resetSeq ? resetSeq : [...sequence, nextIconIdx];

        if (resetSeq) {
            setSequence([nextIconIdx]);
        } else {
            setSequence(newSequence);
        }

        setTimeout(() => playSequence(resetSeq ? [nextIconIdx] : newSequence, currentLevel), 500);
    };

    const playSequence = async (currentSequence, currentLevel) => {
        setIsShowingSequence(true);
        setStatusText("SINCRONIZANDO SECUENCIA...");
        setPlayerSequence([]);
        setNodeStatus({});

        const currentSpeed = Math.max(250, 600 - (currentLevel * 25));

        for (let iconIdx of currentSequence) {
            await wait(currentSpeed);
            const slotIdx = nodeMapping.indexOf(iconIdx);
            highlightNode(slotIdx);
            await wait(currentSpeed);
        }

        // Shuffle Logic (Level >= 5)
        if (currentLevel >= 5) {
            setStatusText("¡INTERFERENCIA DETECTADA!");
            setShuffleActive(true);
            await wait(500);
            shuffleGrid();
            await wait(500);
        } else {
            setShuffleActive(false);
        }

        setStatusText("REPRODUCE EN ORDEN INVERSO");
        setIsShowingSequence(false);
    };

    const highlightNode = (slotIdx) => {
        setActiveNode(slotIdx);
        setTimeout(() => setActiveNode(null), 400);
    };

    const shuffleGrid = () => {
        const newMapping = [...nodeMapping].sort(() => Math.random() - 0.5);
        setNodeMapping(newMapping);
    };

    const handleNodeClick = (slotIdx) => {
        if (!isPlaying || isShowingSequence) return;

        const iconIdxClicked = nodeMapping[slotIdx];
        const newPlayerSequence = [...playerSequence, iconIdxClicked];
        setPlayerSequence(newPlayerSequence);
        highlightNode(slotIdx);

        const currentStep = newPlayerSequence.length - 1;
        const targetSequence = [...sequence].reverse();

        if (newPlayerSequence[currentStep] !== targetSequence[currentStep]) {
            gameOver();
            return;
        }

        if (newPlayerSequence.length === sequence.length) {
            nextLevel();
        }
    };

    const nextLevel = () => {
        const newScore = score + (level * 150);
        const newLevel = level + 1;

        setScore(newScore);
        setLevel(newLevel);
        setStatusText("NIVEL SUPERADO");

        // Success effect
        const allSuccess = {};
        for (let i = 0; i < 9; i++) allSuccess[i] = 'success';
        setNodeStatus(allSuccess);

        setTimeout(() => {
            setNodeStatus({});
            startNextRound(newLevel, newScore);
        }, 800);
    };

    const gameOver = () => {
        setStatusText("FALLO EN LA MATRIZ");

        // Error effect
        const allError = {};
        for (let i = 0; i < 9; i++) allError[i] = 'error';
        setNodeStatus(allError);

        setTimeout(() => {
            setNodeStatus({});
            resetGame();
        }, 1200);
    };

    return (
        <View style={styles.container}>
            <View style={styles.glassPanel}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        NEURO-SYNC <Text style={styles.version}>v2.0 PRO</Text>
                    </Text>
                    <Text style={styles.subtitle}>PROTOCOLO DE ALTA INTERFERENCIA COGNITIVA</Text>
                </View>

                <View style={styles.infoBar}>
                    <View>
                        <Text style={styles.label}>NIVEL ACTUAL</Text>
                        <Text style={styles.valueWhite}>{String(level).padStart(2, '0')}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.label}>PUNTUACIÓN</Text>
                        <Text style={styles.valueBlue}>{String(score).padStart(4, '0')}</Text>
                    </View>
                </View>

                <View style={styles.messageBox}>
                    <Text style={[styles.statusText, textPulseAnimation(isShowingSequence)]}>
                        {statusText}
                    </Text>
                </View>

                <View style={[styles.grid, shuffleActive && styles.shuffling]}>
                    {nodeMapping.map((iconIndex, slotIndex) => {
                        const isActive = activeNode === slotIndex;
                        const status = nodeStatus[slotIndex];
                        let nodeStyle = styles.node;

                        if (isActive) nodeStyle = [styles.node, styles.nodeActive];
                        if (status === 'success') nodeStyle = [styles.node, styles.nodeSuccess];
                        if (status === 'error') nodeStyle = [styles.node, styles.nodeError];

                        return (
                            <TouchableOpacity
                                key={slotIndex}
                                activeOpacity={0.7}
                                style={nodeStyle}
                                onPress={() => handleNodeClick(slotIndex)}
                            >
                                <Text style={styles.icon}>{ICONS[iconIndex]}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {!isPlaying && (
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.startBtn} onPress={() => {
                            setSequence([]);
                            // Small delay to ensure state reset before starting
                            setTimeout(() => {
                                setIsPlaying(true);
                                const firstIcon = Math.floor(Math.random() * 9);
                                setSequence([firstIcon]);
                                setTimeout(() => playSequence([firstIcon], 1), 100);
                            }, 50);
                        }}>
                            <Text style={styles.startBtnText}>INICIAR ENTRENAMIENTO</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isPlaying && (
                    <View style={styles.footer}>
                        <View style={styles.footerRow}>
                            <Text style={styles.footerLabel}>MODO SHUFFLE:</Text>
                            <Text style={[styles.footerValue, shuffleActive ? styles.textOrange : styles.textSlate]}>
                                {level >= 5 ? (shuffleActive ? "ACTIVO 🔥" : "LISTO") : "INACTIVO (NIVEL < 5)"}
                            </Text>
                        </View>
                        <View style={styles.footerRow}>
                            <Text style={styles.footerLabel}>LATENCIA:</Text>
                            <Text style={styles.footerValueBlue}>{Math.max(250, 600 - (level * 25))}ms</Text>
                        </View>
                    </View>
                )}

            </View>
        </View >
    );
};

// Helper for simple pulse animation via state
const textPulseAnimation = (active) => {
    // In a real app we'd use Animated.loop, but for simplicity here we just return a style
    // You could implement a proper Animated.Value loop in useEffect if needed.
    return active ? { opacity: 0.7 } : { opacity: 1 };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050507',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    glassPanel: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(20, 20, 28, 0.85)',
        borderRadius: 40,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderBottomWidth: 4,
        borderBottomColor: 'rgba(30, 58, 138, 0.3)', // blue-900/30
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#3b82f6', // blue-500
        letterSpacing: -1,
    },
    version: {
        fontSize: 12,
        backgroundColor: 'rgba(30, 58, 138, 0.5)',
        color: '#93c5fd', // blue-300
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    subtitle: {
        fontSize: 9,
        color: '#64748b', // slate-500
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontWeight: 'bold',
        marginTop: 4,
        textAlign: 'center',
    },
    infoBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 24,
    },
    label: {
        color: '#64748b',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    valueWhite: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    valueBlue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#60a5fa', // blue-400
    },
    messageBox: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(23, 37, 84, 0.2)', // blue-950/20
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 16,
        marginBottom: 24,
    },
    statusText: {
        color: '#93c5fd', // blue-300
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 32,
    },
    node: {
        width: '30%', // Approx for 3 columns with gap
        aspectRatio: 1,
        backgroundColor: '#16161e',
        borderWidth: 2,
        borderColor: '#2d2d39',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#60a5fa',
        transform: [{ translateY: -2 }],
        // Shadow support for iOS
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 10,
    },
    nodeSuccess: {
        backgroundColor: '#10b981',
        borderColor: '#34d399',
    },
    nodeError: {
        backgroundColor: '#ef4444',
        borderColor: '#f87171',
    },
    icon: {
        fontSize: 32,
    },
    controls: {
        gap: 12,
    },
    startBtn: {
        backgroundColor: '#2563eb', // blue-600 (simplified gradient)
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 4,
    },
    startBtnText: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 16,
    },
    modeContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    modeActive: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
        borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    modeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b', // slate-500
    },
    modeTextActive: {
        color: '#93c5fd', // blue-300
    },
    footer: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        gap: 8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
    },
    footerValue: {
        fontSize: 10,
    },
    textSlate: { color: '#475569' },
    textOrange: { color: '#f97316' },
    footerValueBlue: {
        fontFamily: 'monospace',
        color: '#60a5fa',
        fontSize: 12,
    },
    shuffling: {
        opacity: 0.5, // Simple shuffle effect
    }
});

export default WorkingMemory;