const verifyObjectFlow = (objectCharacter, extraData = {}) => {
    console.log("extraData", JSON.stringify(extraData));

    if (!objectCharacter || typeof objectCharacter !== "object") {
        throw new Error("objectCharacter must be an object\n type: " + typeof objectCharacter + "\n value: " + objectCharacter);
    }

    const flow = objectCharacter.flow;
    if (!flow || typeof flow !== "object") {
        throw new Error("objectCharacter.flow must be an object\n type: " + typeof flow + "\n value: " + flow);
    }

    const requiredKeys = ["puzzle", "puzzleProps", "onResolve", "onFail"];

    const validateNode = (node, path, depth) => {
        if (depth > 20) {
            throw new Error(`Flow structure at ${path} is too deep or has circular references`);
        }

        const isObject = node && typeof node === "object" && !Array.isArray(node);

        if (!isObject) {
            throw new Error(`${path} must be an object`);
        }

        if (!("phase" in node) && !("fase" in node)) {
            throw new Error(`${path} must have 'phase' or 'fase' at ${path} `);
        }

        for (const key of requiredKeys) {
            if (!(key in node)) {
                throw new Error(`${path} must have '${key}' at ${path} `);
            }
        }

        if (node.onResolve && typeof node.onResolve === "object") {
            validateNode(node.onResolve, `${path}.onResolve`, depth + 1);
        }
        if (node.onFail && typeof node.onFail === "object") {
            validateNode(node.onFail, `${path}.onFail`, depth + 1);
        }
        return true;
    };

    validateNode(flow, "flow", 0);
    return true;
};

export { verifyObjectFlow };