import React, { useState } from "react";
import { View, Text } from "react-native";
import { verifyObjectFlow } from "../logic/verify";
import WorkingMemory from "../components/games/WorkingMemory/WorkingMemory";

const Duel = ({ objectCharacter }) => {
    const { flow } = objectCharacter;
    try {
        verifyObjectFlow(flow);
    } catch (error) {
        console.error(error);
    }

    const [phase, setPhase] = useState(flow.phase);
    const [puzzle, setPuzzle] = useState(flow.puzzle);
    const [puzzleProps, setPuzzleProps] = useState(flow.puzzleProps);

    const onFinish = (result) => {
        if (typeof result === "string") {
            if (result === "finish") {

            } else if (result === "fail") {

            }
        };

        const newPhase = result.phase;
        const newPuzzle = result.puzzle;
        const newPuzzlePropts = result.puzzleProps;

        setPuzzle(newPuzzle);
        setPuzzleProps(newPuzzlePropts);

    }

    return (
        <View>
            {puzzle === "workingMemory" && (
                <WorkingMemory
                    onFinish={onFinish}
                    {...puzzleProps}
                />
            )}
        </View>
    );
};

export default Duel;
