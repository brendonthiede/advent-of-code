fs = require('fs')

function getInputs(type) {
    const pairs = fs.readFileSync(`${__dirname}/${type}.txt`, 'utf8').split(/\r?\n/).map((line) => line.replace(/:/g, ',').replace(/[a-z= ]*/ig, '').split(',').map(Number))
    const sensors = pairs.reduce((sensors, [sx, sy, bx, by]) => sensors.add(`${sx},${sy}`), new Set())
    const beacons = pairs.reduce((beacons, [sx, sy, bx, by]) => beacons.add(`${bx},${by}`), new Set())
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
    return { pairs, sensors, beacons, coverageRanges }
}

function findHoles(inputs, row) {
    const beacons = inputs.beacons
    return inputs.pairs.reduce((holes, [sx, sy, bx, by]) => {
        const manhattanDistance = Math.abs(sx - bx) + Math.abs(sy - by)
        if (row >= sy - manhattanDistance && row <= sy + manhattanDistance) {
            const xReach = Math.abs(manhattanDistance - Math.abs(sy - row))
            for (let x = sx - xReach; x <= sx + xReach; x++) {
                if (!beacons.has(`${x},${row}`) && !holes.has(`${x},${row}`)) holes.add(`${x},${row}`)
            }
        }
        return holes
    }, new Set())
}

function runSample() {
    const samples = getInputs('sample')

    for (let row = -2; row <= 22; row++) {
        const holes = findHoles(samples, row)
        let output = ''
        for (let col = -4; col <= 26; col++) {
            const pos = `${col},${row}`
            if (samples.sensors.has(pos)) output += 'S'
            else if (samples.beacons.has(pos)) output += 'B'
            else if (holes.has(pos)) output += '#'
            else output += '.'
        }
        console.log(output)
    }
    const part1 = findHoles(samples, 10).size
    if (part1 !== 26) throw new Error(`Expected 26, got ${part1}`)
    console.log(`Answer for part 1 with sample input is: ${part1}`)

    for (let row = 0; row <= 20; row++) {
        if (samples.coverageRanges[row]) {
            console.log(`Row ${row}: ` + samples.coverageRanges[row].reduce((output, range) => output + `[${range[0]},${range[1]}]`, ''))
        }
    }

    for (let row = 0; row <= 20; row++) {
        const holes = findHoles(samples, row)
        let rowLabel = `${' ' + row}`
        rowLabel = rowLabel.substring(rowLabel.length - 2)
        let output = `Row ${rowLabel}: `
        for (let col = 0; col <= 20; col++) {
            const pos = `${col},${row}`
            if (samples.sensors.has(pos)) output += 'S'
            else if (samples.beacons.has(pos)) output += 'B'
            else if (holes.has(pos)) output += '#'
            else output += '.'
        }
        console.log(output)
    }

    const limit = 20
    let location = null
    for (let row = 0; row <= limit; row++) {
        const rangesToConsider = samples.coverageRanges[row]
        if (rangesToConsider) {
            rangesToConsider.forEach(range => {
                if (range[0] <= 0 && range[1] < limit) {
                    location = { x: range[1] + 1, y: row }
                }
            });
        }
        if (location) break
    }
    console.log(`Answer for part 2 with sample input is: ${location.x * 4000000 + location.y}`)
}

runSample(); return

const inputs = getInputs('input')
console.log(`Answer for part 1: ${findHoles(inputs, 2000000).size}`)

const limit = 4000000
let location = null
for (let row = 0; row <= limit; row++) {
    const rangesToConsider = inputs.coverageRanges[row]
    if (rangesToConsider) {
        rangesToConsider.forEach(range => {
            if (range[0] <= 0 && range[1] < limit) {
                location = { x: range[1] + 1, y: row }
            }
        });
    }
    if (location) break
}
console.log(`Answer for part 2: ${location.x * 4000000 + location.y}`)
