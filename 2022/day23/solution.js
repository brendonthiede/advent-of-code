const directions = new Map([
    ['N', [[-1, -1], [0, -1], [1, -1]]],
    ['S', [[-1, 1], [0, 1], [1, 1]]],
    ['W', [[-1, -1], [-1, 0], [-1, 1]]],
    ['E', [[1, -1], [1, 0], [1, 1]]]
])

function getInput(inputType) {
    const fs = require('fs')
    const elfPositions = new Set()
    fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
        .split(/\r?\n/)
        .forEach((line, y) => {
            line.split('').forEach((val, x) => {
                if (val === '#') {
                    elfPositions.add(`${x},${y}`)
                }
            })
        })
    return elfPositions
}

function getExtremes(elfPositions) {
    const xs = [...elfPositions.values()].map((pos) => parseInt(pos.split(',')[0]))
    const ys = [...elfPositions.values()].map((pos) => parseInt(pos.split(',')[1]))
    return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys)
    }
}

function printElves(elfPositions, round) {
    const { minX, maxX, minY, maxY } = getExtremes(elfPositions)
    console.log(`${"\n"}Round ${round}`)
    for (let y = minY; y <= maxY; y++) {
        let line = ''
        for (let x = minX; x <= maxX; x++) {
            line += elfPositions.has(`${x},${y}`) ? '#' : '.'
        }
        console.log(line)
    }
}

function canMove(elfPositions, x, y, cardinalDirection) {
    const checks = directions.get(cardinalDirection)
    for (let i = 0; i < checks.length; i++) {
        const [dx, dy] = checks[i]
        if (elfPositions.has(`${x + dx},${y + dy}`)) return false
    }
    return true
}

function north(x, y) {
    return `${x},${y - 1}`
}

function northWest(x, y) {
    return `${x - 1},${y - 1}`
}

function northEast(x, y) {
    return `${x + 1},${y - 1}`
}

function south(x, y) {
    return `${x},${y + 1}`
}

function southWest(x, y) {
    return `${x - 1},${y + 1}`
}

function southEast(x, y) {
    return `${x + 1},${y + 1}`
}

function west(x, y) {
    return `${x - 1},${y}`
}

function east(x, y) {
    return `${x + 1},${y}`
}

function hasNeighbor(elfPositions, x, y) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            if (elfPositions.has(`${x + dx},${y + dy}`)) return true
        }
    }
    return false
}

function proposeNorth(elfPositions, x, y) {
    if (!elfPositions.has(north(x, y)) && !elfPositions.has(northEast(x, y)) && !elfPositions.has(northWest(x, y))) {
        return north(x, y)
    }
    return ''
}

function proposeSouth(elfPositions, x, y) {
    if (!elfPositions.has(south(x, y)) && !elfPositions.has(southEast(x, y)) && !elfPositions.has(southWest(x, y))) {
        return south(x, y)
    }
    return ''
}

function proposeWest(elfPositions, x, y) {
    if (!elfPositions.has(west(x, y)) && !elfPositions.has(northWest(x, y)) && !elfPositions.has(southWest(x, y))) {
        return west(x, y)
    }
    return ''
}

function proposeEast(elfPositions, x, y) {
    if (!elfPositions.has(east(x, y)) && !elfPositions.has(northEast(x, y)) && !elfPositions.has(southEast(x, y))) {
        return east(x, y)
    }
    return ''
}

function moveIt(elfPositions, rounds, isDebugEnabled) {
    const directives = [
        proposeNorth,
        proposeSouth,
        proposeWest,
        proposeEast
    ]
    for (let round = 0; round < rounds; round++) {
        // get proposals
        const newElfPositions = new Map()
        elfPositions.forEach((pos) => {
            const [x, y] = pos.split(',').map((val) => parseInt(val))
            let proposal = ''
            if (hasNeighbor(elfPositions, x, y)) {
                for (let i = 0; i < directives.length; i++) {
                    proposal = directives[i](elfPositions, x, y)
                    if (proposal.length > 0) {
                        if (newElfPositions.has(proposal)) {
                            newElfPositions.get(proposal).push(`${x},${y}`)
                        } else {
                            newElfPositions.set(proposal, [`${x},${y}`])
                        }

                        break
                    }
                }
            }
        })

        // shift the directives
        const firstDirective = directives.shift()
        directives.push(firstDirective)

        // quit if no proposals
        if (newElfPositions.size === 0) {
            return round
        }
        // consider proposals
        newElfPositions.forEach((proposers, pos) => {
            if (proposers.length === 1) {
                elfPositions.delete(proposers[0])
                elfPositions.add(pos)
            }
        })

        if (isDebugEnabled) printElves(elfPositions, round + 1)
    }
    return rounds
}

const inputType = 'input'
const isDebugEnabled = inputType !== 'input'

const originalElfPositions = getInput(inputType)

let elfPositions = new Set(originalElfPositions)
moveIt(elfPositions, 10, isDebugEnabled)

const extremes = getExtremes(elfPositions)
const area = (extremes.maxX - extremes.minX + 1) * (extremes.maxY - extremes.minY + 1)
const elfCount = elfPositions.size
console.log(`Answer for part 1: ${area - elfCount}`)

elfPositions = new Set(originalElfPositions)
const lastRound = moveIt(elfPositions, Infinity, isDebugEnabled)
console.log(`Answer for part 2: ${lastRound + 1}`)
