
const generateArray = require('./src/components/games/matrix/logic/generateArray.js').default;

// Mock Math.random to ensure we can run this in node if needed, 
// though the original file has export default which needs module support.
// We'll trust the environment or just copy the logic effectively for a quick test if import fails.
// Since this is writing to a temp file, I'll essentially wrap the logic or try to run it directly if environment allows.
// Given it's a React Native project, standard `node` might trip on `export default`.
// So I will create a self-contained test file that includes the logic for verification purposes.

const runTest = () => {
    // --- Paste logic here for standalone testing ease ---
    const generateArray = () => {
        const SIZE = 6;
        const TARGET = 3;
        const grid = Array(SIZE).fill(null).map(() =>
            Array(SIZE).fill(null).map(() =>
                Array(SIZE).fill(null)
            )
        );

        const getShuffledValues = () => Math.random() > 0.5 ? [true, false] : [false, true];

        const isValid = (z, y, x, val) => {
            if (x >= 2 && grid[z][y][x - 1] === val && grid[z][y][x - 2] === val) return false;
            let rowCount = 0;
            for (let i = 0; i < x; i++) if (grid[z][y][i] === val) rowCount++;
            if (rowCount + 1 > TARGET) return false;
            if ((TARGET - (rowCount + 1)) > (SIZE - 1 - x)) return false;

            if (y >= 2 && grid[z][y - 1][x] === val && grid[z][y - 2][x] === val) return false;
            let colCount = 0;
            for (let j = 0; j < y; j++) if (grid[z][j][x] === val) colCount++;
            if (colCount + 1 > TARGET) return false;
            if ((TARGET - (colCount + 1)) > (SIZE - 1 - y)) return false;

            if (z >= 2 && grid[z - 1][y][x] === val && grid[z - 2][y][x] === val) return false;
            let pillarCount = 0;
            for (let k = 0; k < z; k++) if (grid[k][y][x] === val) pillarCount++;
            if (pillarCount + 1 > TARGET) return false;
            if ((TARGET - (pillarCount + 1)) > (SIZE - 1 - z)) return false;

            return true;
        };

        const solve = (index) => {
            if (index === SIZE * SIZE * SIZE) return true;
            const z = Math.floor(index / 36);
            const y = Math.floor((index % 36) / 6);
            const x = index % 6;
            const candidates = getShuffledValues();
            for (const val of candidates) {
                if (isValid(z, y, x, val)) {
                    grid[z][y][x] = val;
                    if (solve(index + 1)) return true;
                    grid[z][y][x] = null;
                }
            }
            return false;
        };

        solve(0);
        return grid;
    };
    // --------------------------------------------------

    console.log("Generating 3D Array...");
    const start = process.hrtime();
    const grid = generateArray();
    const end = process.hrtime(start);
    const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
    console.log(`Generation took ${timeInMs}ms`);

    const SIZE = 6;
    let errors = [];

    // Check Dimensions
    if (grid.length !== SIZE) errors.push("Invalid Z size");
    grid.forEach((layer, z) => {
        if (layer.length !== SIZE) errors.push(`Invalid Y size at z=${z}`);
        layer.forEach((row, y) => {
            if (row.length !== SIZE) errors.push(`Invalid X size at z=${z}, y=${y}`);
        });
    });

    // Validates a sequence for balance (3/3) and continuity (max 2 consecutive)
    const validateSequence = (seq, context) => {
        const trueCount = seq.filter(v => v === true).length;
        const falseCount = seq.filter(v => v === false).length;
        if (trueCount !== 3 || falseCount !== 3) {
            errors.push(`${context}: Balance error (True=${trueCount}, False=${falseCount})`);
        }
        for (let i = 0; i < seq.length - 2; i++) {
            if (seq[i] === seq[i + 1] && seq[i] === seq[i + 2]) {
                errors.push(`${context}: Consecutive error at index ${i} (${seq[i]})`);
            }
        }
    };

    // Check Rows (X)
    for (let z = 0; z < SIZE; z++) {
        for (let y = 0; y < SIZE; y++) {
            validateSequence(grid[z][y], `Row z=${z}, y=${y}`);
        }
    }

    // Check Columns (Y)
    for (let z = 0; z < SIZE; z++) {
        for (let x = 0; x < SIZE; x++) {
            const col = [];
            for (let y = 0; y < SIZE; y++) col.push(grid[z][y][x]);
            validateSequence(col, `Col z=${z}, x=${x}`);
        }
    }

    // Check Pillars (Z)
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const pillar = [];
            for (let z = 0; z < SIZE; z++) pillar.push(grid[z][y][x]);
            validateSequence(pillar, `Pillar y=${y}, x=${x}`);
        }
    }

    if (errors.length === 0) {
        console.log("SUCCESS: Grid satisfies all constraints.");
    } else {
        console.log("FAILED: Found errors:");
        errors.slice(0, 10).forEach(e => console.log(e));
        if (errors.length > 10) console.log(`...and ${errors.length - 10} more.`);
    }
};

runTest();
