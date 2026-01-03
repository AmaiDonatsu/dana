import React, { useState } from "react";
import { View, Text } from "react-native";
import { verifyObjectFlow } from "../logic/verify";
import WorkingMemory from "../components/games/WorkingMemory/WorkingMemory";

const Duel = ({ route, navigation }) => {
    const { objectCharacter } = route.params || {};

    if (!objectCharacter) {
        return (
            <View>
                <Text>Error: No character data provided</Text>
            </View>
        );
    }

    const { flow: initialFlow } = objectCharacter;

    // safe check logic
    try {
        verifyObjectFlow(initialFlow);
    } catch (error) {
        console.error(error);
        return (
            <View>
                <Text>Error: Invalid Flow Structure</Text>
            </View>
        );
    }

    const [currentFlow, setCurrentFlow] = useState(initialFlow);
    const [phase, setPhase] = useState(initialFlow.phase);
    const [puzzle, setPuzzle] = useState(initialFlow.puzzle);
    const [puzzleProps, setPuzzleProps] = useState(initialFlow.puzzleProps);
    const [finishState, setFinishState] = useState("");

    const onFinish = (result) => {
        if (typeof result === "string") {
            if (result === "finish") {
                setFinishState("finish");
            } else if (result === "fail") {
                setFinishState("fail");
            }
            return;
        }

        // If result is an object, it's the next flow node
        // We render the next phase
        const nextFlow = result;

        // Optional: Verify next flow structure
        try {
            verifyObjectFlow({ flow: nextFlow }); // wrapping in object as verifyObjectFlow expects { flow: ... } or modify verify function
        } catch (e) {
            console.error("Invalid next flow:", e);
            // Handle error or just fail
            setFinishState("fail");
            return;
        }

        setCurrentFlow(nextFlow);
        setPhase(nextFlow.phase);
        setPuzzle(nextFlow.puzzle);
        setPuzzleProps(nextFlow.puzzleProps);
    };

    return (
        <View style={{ flex: 1 }}>
            {finishState ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {finishState === "finish" && <Text style={{ color: 'white', fontSize: 24 }}>Mission Complete</Text>}
                    {finishState === "fail" && <Text style={{ color: 'red', fontSize: 24 }}>System Failure</Text>}
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    {/* Optional: Display Phase info somewhere if needed, but WorkingMemory takes full screen usually */}
                    {
                        puzzle === "workingMemory" && (
                            <WorkingMemory
                                onFinish={onFinish}
                                flow={currentFlow}
                                {...puzzleProps}
                            />
                        )
                    }
                </View>
            )}
        </View>
    );
};

export default Duel;
