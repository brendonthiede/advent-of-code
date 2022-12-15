fs = require('fs')

function getInputs(type) {
    const pairs = fs.readFileSync(`${__dirname}/${type}.txt`, 'utf8').split(/\r?\n/).map((line) => line.replace(/:/g, ',').replace(/[a-z= ]*/ig, '').split(',').map(Number))
    const coverageRanges = pairs.reduce((ranges, [sx, sy, bx, by]) => {
        const manhattanDistance = Math.abs(sx - bx) + Math.abs(sy - by)
        for (let y = sy - manhattanDistance; y <= sy + manhattanDistance; y++) {
            const xReach = Math.abs(manhattanDistance - Math.abs(sy - y))
            const rowRange = [sx - xReach, sx + xReach]
            if (!ranges[y] || ranges[y].length == 0) {
                ranges[y] = [rowRange]
            } else {
                for (let i = ranges[y].length - 1; i >= 0; i--) {
                    if (rowRange[0] <= ranges[y][i][1] + 1 && ranges[y][i][0] - 1 <= rowRange[1]) {
                        rowRange[0] = Math.min(rowRange[0], ranges[y][i][0])
                        rowRange[1] = Math.max(rowRange[1], ranges[y][i][1])
                        ranges[y].splice(i, 1)
                    }
                }
                ranges[y].push(rowRange)
            }
        }
        return ranges
    }, [])
    return { pairs, coverageRanges }
}

function countHoles(inputs, row) {
    const beaconsInRow = inputs.pairs.reduce((unique, [sx, sy, bx, by]) => { return by === row ? unique.add(bx) : unique }, new Set()).size
    const holes = inputs.coverageRanges[row].reduce((count, range) => count + range[1] - range[0] + 1, 0)
    return holes - beaconsInRow
}

function findLocation(inputs, limit) {
    for (let row = 0; row <= limit; row++) {
        const rangesToConsider = inputs.coverageRanges[row]
        for (let index = 0; index < rangesToConsider.length; index++) {
            const range = rangesToConsider[index];
            if (range[0] <= 0 && range[1] < limit) {
                return { x: range[1] + 1, y: row }
            }
        }
    }
}

const inputs = getInputs('input')

console.log(`Answer for part 1: ${countHoles(inputs, 2000000)}`)

const location = findLocation(inputs, 4000000)
console.log(`Answer for part 2: ${location.x * 4000000 + location.y}`)
