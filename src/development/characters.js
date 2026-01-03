const characters = [
    {
        name: "Memory Master",
        flow: {
            phase: "puzzle",
            puzzle: "workingMemory",
            puzzleProps: {
                levelMax: 10,
                velocity: 3,
            },
            onResolve: "finish",
            onFail: "fail",
        }
    }
];

export default characters;