const BLIZZARD_DIRECTIONS = {
    '>': { x: 1, y: 0 },
    '<': { x: -1, y: 0 },
    '^': { x: 0, y: -1 },
    'v': { x: 0, y: 1 },
}

const MOVES = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
]

function getInput(inputType) {
    const fs = require('fs')
    const locations = new Map()
    const lines = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
        .split(/\r?\n/)

    for (let y = 1; y < lines.length - 1; y++) {
        const line = lines[y]
        line.split('').forEach((val, x) => {
            if (val === '#') return
            if (val !== '.') locations.set(`${x},${y}`, val)
        })
    }

    return { locations, boundaries: { x: lines[0].length - 1, y: lines.length - 1 } }
}

function getBlockages(blizzardMap) {
    const originalMapAsString = mapToString(blizzardMap)
    const blockages = new Set()
    let i = 0
    while (true) {
        if (isDebugEnabled) printMap(blizzardMap)
        addBlockage(blizzardMap, blockages, i++)
        blizzardMap = moveBlizzards(blizzardMap)
        if (mapToString(blizzardMap) === originalMapAsString) {
            break
        }
    }

    blizzardMap.cycleLength = i
    blizzardMap.blockages = blockages

    return blizzardMap
}

function moveBlizzards(blizzardMap) {
    const newLocations = new Map()
    blizzardMap.locations.forEach((blizzards, coords) => {
        const [x, y] = coords.split(',').map(Number)
        blizzards.split('').forEach(direction => {
            const { x: dx, y: dy } = BLIZZARD_DIRECTIONS[direction]
            let newCoords = `${x + dx},${y + dy}`
            if (x + dx === 0) {
                newCoords = `${blizzardMap.boundaries.x - 1},${y + dy}`
            } else if (x + dx === blizzardMap.boundaries.x) {
                newCoords = `1,${y + dy}`
            } else if (y + dy === 0) {
                newCoords = `${x + dx},${blizzardMap.boundaries.y - 1}`
            } else if (y + dy === blizzardMap.boundaries.y) {
                newCoords = `${x + dx},1`
            }

            let newBlizzards = direction
            if (newLocations.has(newCoords)) {
                newBlizzards += newLocations.get(newCoords)
            }
            newLocations.set(newCoords, newBlizzards)
        })
    })
    return { locations: newLocations, boundaries: blizzardMap.boundaries }
}

function addBlockage(blizzardMap, blockages, time) {
    blizzardMap.locations.forEach((_, coords) => {
        blockages.add(`${coords},${time}`)
    })
    return blockages
}

function mapToString(blizzardMap, isPrintable = false) {
    let str = ''
    const entrance = `#.${'#'.repeat(blizzardMap.boundaries.x - 1)}`
    str += `${entrance}\n`
    for (let y = 1; y < blizzardMap.boundaries.y; y++) {
        let line = '#'
        for (let x = 1; x < blizzardMap.boundaries.x; x++) {
            const coords = `${x},${y}`
            if (blizzardMap.locations.has(coords)) {
                const val = blizzardMap.locations.get(coords)
                if (isPrintable) {
                    line += val.length === 1 ? val : val.length
                } else {
                    line += `|${val}`
                }
            } else {
                line += '.'
            }
        }
        str += `${line}#\n`
    }
    str += `${entrance.split('').reverse().join('')}\n`
    return str
}

function printMap(blizzardMap, asRaw = false) {
    console.log('\n')
    console.log(mapToString(blizzardMap, !asRaw))
}

function breadthFirstSearch(blizzardMap, start, destination, startingTime) {
    const queue = [`${start.x},${start.y},${startingTime}`]
    const visited = new Set([queue[0]])
    while (queue.length > 0) {
        const current = queue.shift()
        const [x, y, t] = current.split(',').map(Number)
        for (let move of MOVES) {
            const { x: dx, y: dy } = move

            // Check if the new coords are the destination
            if (x + dx === destination.x && y + dy === destination.y) {
                return t + 1
            }

            // Check if the new coords are within the map boundaries or if they are the start coords
            if ((x + dx > 0 && x + dx < blizzardMap.boundaries.x &&
                y + dy > 0 && y + dy < blizzardMap.boundaries.y) ||
                (x + dx === start.x && y + dy === start.y)) {
                const newCoords = `${x + dx},${y + dy},${t + 1}`
                // Check if the new coords have been visited or if they are blocked, adjusting for the cycle length of the blizzards
                const cyclicalCoords = `${x + dx},${y + dy},${(t + 1) % blizzardMap.cycleLength}`
                if (!visited.has(newCoords) && !blizzardMap.blockages.has(cyclicalCoords)) {
                    visited.add(newCoords)
                    queue.push(newCoords)
                }
            }
        }
    }
}

const inputType = 'input'
const isDebugEnabled = inputType !== 'input'

let blizzardMap = getInput(inputType)
blizzardMap = getBlockages(blizzardMap)

const entrance = { x: 1, y: 0 }
const exit = { x: blizzardMap.boundaries.x - 1, y: blizzardMap.boundaries.y }

const timeToExit = breadthFirstSearch(blizzardMap, entrance, exit, 0)
console.log(`Answer to part 1: ${timeToExit}`)

const timeToGetBack = breadthFirstSearch(blizzardMap, exit, entrance, timeToExit)
const timeToExitAgain = breadthFirstSearch(blizzardMap, entrance, exit, timeToGetBack)
console.log(`Answer to part 2: ${timeToExitAgain}`)
