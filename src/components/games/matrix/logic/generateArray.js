const generateArray = () => {
    const SIZE = 6;
    const TARGET = 3; // 3 true, 3 false
    const grid = Array(SIZE).fill(null).map(() =>
        Array(SIZE).fill(null).map(() =>
            Array(SIZE).fill(null)
        )
    );

    // Helper to shuffle [0, 1] for randomness
    const getShuffledValues = () => {
        return Math.random() > 0.5 ? [true, false] : [false, true];
    };

    const isValid = (z, y, x, val) => {
        // 1. Check Row (X-axis)
        // Consecutive
        if (x >= 2 && grid[z][y][x - 1] === val && grid[z][y][x - 2] === val) return false;

        // Balance
        let rowCount = 0;
        for (let i = 0; i < x; i++) {
            if (grid[z][y][i] === val) rowCount++;
        }
        if (rowCount + 1 > TARGET) return false;
        // Pruning: if strictly not enough spots left to reach target
        if ((TARGET - (rowCount + 1)) > (SIZE - 1 - x)) return false;


        // 2. Check Column (Y-axis)
        // Consecutive
        if (y >= 2 && grid[z][y - 1][x] === val && grid[z][y - 2][x] === val) return false;

        // Balance
        let colCount = 0;
        for (let j = 0; j < y; j++) {
            if (grid[z][j][x] === val) colCount++;
        }
        if (colCount + 1 > TARGET) return false;
        if ((TARGET - (colCount + 1)) > (SIZE - 1 - y)) return false;


        // 3. Check Pillar (Z-axis)
        // Consecutive
        if (z >= 2 && grid[z - 1][y][x] === val && grid[z - 2][y][x] === val) return false;

        // Balance
        let pillarCount = 0;
        for (let k = 0; k < z; k++) {
            if (grid[k][y][x] === val) pillarCount++;
        }
        if (pillarCount + 1 > TARGET) return false;
        if ((TARGET - (pillarCount + 1)) > (SIZE - 1 - z)) return false;

        return true;
    };

    const solve = (index) => {
        if (index === SIZE * SIZE * SIZE) {
            return true;
        }

        const z = Math.floor(index / (SIZE * SIZE));
        const y = Math.floor((index % (SIZE * SIZE)) / SIZE);
        const x = index % SIZE;

        const candidates = getShuffledValues();

        for (const val of candidates) {
            if (isValid(z, y, x, val)) {
                grid[z][y][x] = val;
                if (solve(index + 1)) {
                    return true;
                }
                grid[z][y][x] = null; // Backtrack
            }
        }

        return false;
    };

    solve(0);
    return grid;
};

export default generateArray;