import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { SvgXml } from 'react-native-svg';
import { ALL_ICONS } from '../../../../assets/res/workingmemory/icons';

const INITIAL_MAPPING = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const WorkingMemory = ({ onFinish, flow, levelMax = "infinito", velocity = 3, }) => {
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
    const [icons, setIcons] = useState([]);
    const [nodeStatus, setNodeStatus] = useState({}); // { slotIndex: 'success' | 'error' | null }
    const soundRef = useRef(null);

    // Dynamic Icon Selection
    useEffect(() => {
        if (ALL_ICONS.length >= 9) {
            const shuffled = [...ALL_ICONS].sort(() => 0.5 - Math.random());
            setIcons(shuffled.slice(0, 9));
        } else {
            console.warn("Se requieren al menos 9 iconos en assets/res/workingmemory");
            setIcons(ALL_ICONS); // Fallback to all available
        }
    }, []);

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

        const baseSpeed = 600 - (currentLevel * 25);
        const currentSpeed = Math.max(100, baseSpeed * (3 / velocity));

        for (let iconIdx of currentSequence) {
            await wait(currentSpeed);
            const slotIdx = nodeMapping.indexOf(iconIdx);
            highlightNode(slotIdx, currentSpeed * 0.8);
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

    const highlightNode = (slotIdx, duration = 400) => {
        setActiveNode(slotIdx);
        setTimeout(() => setActiveNode(null), duration);
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

        const baseSpeed = 600 - (level * 25);
        const currentSpeed = Math.max(100, baseSpeed * (3 / velocity));
        highlightNode(slotIdx, currentSpeed * 0.8);

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
        }, 800 / velocity);
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
        }, 1200 / velocity);

        if (typeof levelMax === "number") {
            if (level >= levelMax) {
                onFinish(flow.onResolve);
            } else {
                onFinish(flow.onFail);
            }
        };
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>NIVEL</Text>
                    <Text style={styles.statValue}>{String(level).padStart(2, '0')}</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.gameTitle}>MEMORIA IMPERIAL</Text>
                </View>
                <View style={[styles.statBox, { alignItems: 'flex-end' }]}>
                    <Text style={styles.statLabel}>PUNTOS</Text>
                    <Text style={styles.statValue}>{String(score).padStart(4, '0')}</Text>
                </View>
            </View>

            <View style={styles.mainArea}>
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
                                {icons[iconIndex] ? (
                                    <SvgXml xml={icons[iconIndex].xml} width="70%" height="70%" />
                                ) : (
                                    <Text style={styles.icon}>?</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.footerInfo}>
                <Text style={[styles.statusText, textPulseAnimation(isShowingSequence)]}>
                    {statusText}
                </Text>
            </View>

            {!isPlaying && (
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.startBtn} onPress={() => {
                        setSequence([]);
                        setTimeout(() => {
                            setIsPlaying(true);
                            const firstIcon = Math.floor(Math.random() * 9);
                            setSequence([firstIcon]);
                            setTimeout(() => playSequence([firstIcon], 1), 100);
                        }, 50);
                    }}>
                        <Text style={styles.startBtnText}>INICIAR RITUAL</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View >
    );
};

// Helper for simple pulse animation via state
const textPulseAnimation = (active) => {
    return active ? { opacity: 0.5 } : { opacity: 1 };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D', // Negro Lacado / Tinta China
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    topBar: {
        width: '100%',
        maxWidth: 400,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    statBox: {
        borderWidth: 1,
        borderColor: '#D4AF37', // Oro Imperial
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'rgba(13, 13, 13, 0.8)',
    },
    statLabel: {
        color: '#D4AF37',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
        fontFamily: 'serif', // Tradición
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00FF9D', // Verde Jade Neón
        fontFamily: 'monospace',
    },
    titleContainer: {
        paddingTop: 10,
    },
    gameTitle: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 4,
        textAlign: 'center',
        fontFamily: 'serif',
    },
    mainArea: {
        flex: 1,
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    node: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeActive: {
        borderColor: '#00FF9D', // Jade glow
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        shadowColor: '#00FF9D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    nodeSuccess: {
        borderColor: '#00FF9D',
        backgroundColor: 'rgba(0, 255, 157, 0.2)',
    },
    nodeError: {
        borderColor: '#E63946', // Rojo Bermellón
        backgroundColor: 'rgba(230, 57, 70, 0.2)',
    },
    icon: {
        fontSize: 32,
        color: '#555',
    },
    footerInfo: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.3)', // Fade gold
        paddingTop: 15,
    },
    statusText: {
        color: '#D4AF37',
        fontSize: 12,
        letterSpacing: 2,
        fontFamily: 'serif',
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(13, 13, 13, 0.8)', // Darken background slightly
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    startBtn: {
        borderWidth: 2,
        borderColor: '#D4AF37',
        backgroundColor: '#0D0D0D',
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: 200,
        alignItems: 'center',
    },
    startBtnText: {
        color: '#00FF9D',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 4,
        fontFamily: 'serif',
    },
    shuffling: {
        opacity: 0.3,
    }
});

export default WorkingMemory;
