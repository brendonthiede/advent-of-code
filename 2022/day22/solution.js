const TILE = '.'
const WALL = '#'
const PATH_DECORATORS = ['>', 'V', '<', '^']

const SAMPLE_FACE_SIZE = 4
const SAMPLE_FACES = [
    [9, 9, 0, 9],
    [1, 2, 3, 9],
    [9, 9, 4, 5]
]

const SAMPLE_FACE_ACTIONS = new Map([
    [0, {
        0: { face: 5, directionChange: 2, offset: [12, 4] },
        1: { face: 3, directionChange: 0, offset: [8, 0] },
        2: { face: 2, directionChange: 3, offset: [4, 0] },
        3: { face: 1, directionChange: 2, offset: [0, 0] },
    }],
    [1, {
        0: { face: 2, directionChange: 0, offset: [0, 4] },
        1: { face: 4, directionChange: 3, offset: [8, 12] },
        2: { face: 5, directionChange: 1, offset: [12, 12] },
        3: { face: 0, directionChange: 2, offset: [-4, 8] },
    }],
    [2, {
        0: { face: 3, directionChange: 0, offset: [4, 4] },
        1: { face: 4, directionChange: 3, offset: [4, 8] },
        2: { face: 1, directionChange: 0, offset: [4, 4] },
        3: { face: 0, directionChange: 1, offset: [4, 0] },
    }],
    [3, {
        0: { face: 5, directionChange: 1, offset: [12, 4] },
        1: { face: 4, directionChange: 0, offset: [8, 4] },
        2: { face: 2, directionChange: 0, offset: [8, 4] },
        3: { face: 0, directionChange: 0, offset: [8, 4] },
    }],
    [4, {
        0: { face: 5, directionChange: 0, offset: [8, 8] },
        1: { face: 1, directionChange: 2, offset: [0, 8] },
        2: { face: 2, directionChange: 1, offset: [4, 8] },
        3: { face: 3, directionChange: 0, offset: [8, 8] },
    }],
    [5, {
        0: { face: 0, directionChange: 2, offset: [12, 0] },
        1: { face: 1, directionChange: 3, offset: [-4, 4] },
        2: { face: 4, directionChange: 0, offset: [12, 8] },
        3: { face: 3, directionChange: 3, offset: [12, 4] },
    }]
])


let FACE_SIZE = 50
let FACES = [
    [9, 0, 1],
    [9, 2, 9],
    [3, 4, 9],
    [5, 9, 9]
]

let FACE_ACTIONS = new Map([
    [0, {
        0: { face: 1, directionChange: 0, offset: [50, 0] },
        1: { face: 2, directionChange: 0, offset: [50, 0] },
        2: { face: 3, directionChange: 2, offset: [-50, 100] },
        3: { face: 5, directionChange: 1, offset: [-50, 150] },
    }],
    [1, {
        0: { face: 4, directionChange: 2, offset: [100, 100] },
        1: { face: 2, directionChange: 1, offset: [100, 50] },
        2: { face: 0, directionChange: 0, offset: [100, 0] },
        3: { face: 5, directionChange: 0, offset: [0, 200] },
    }],
    [2, {
        0: { face: 1, directionChange: 3, offset: [100, 50] },
        1: { face: 4, directionChange: 0, offset: [50, 50] },
        2: { face: 3, directionChange: 3, offset: [0, 50] },
        3: { face: 0, directionChange: 0, offset: [50, 50] },
    }],
    [3, {
        0: { face: 4, directionChange: 0, offset: [0, 100] },
        1: { face: 5, directionChange: 0, offset: [0, 100] },
        2: { face: 0, directionChange: 2, offset: [0, 0] },
        3: { face: 2, directionChange: 1, offset: [0, 50] },
    }],
    [4, {
        0: { face: 1, directionChange: 2, offset: [150, 0] },
        1: { face: 5, directionChange: 1, offset: [50, 150] },
        2: { face: 3, directionChange: 0, offset: [50, 100] },
        3: { face: 2, directionChange: 0, offset: [50, 100] },
    }],
    [5, {
        0: { face: 4, directionChange: 3, offset: [50, 150] },
        1: { face: 1, directionChange: 0, offset: [100, -50] },
        2: { face: 0, directionChange: 3, offset: [50, -50] },
        3: { face: 3, directionChange: 0, offset: [0, 150] },
    }],
])

function getInput(inputType) {
    const fs = require('fs')
    const sections = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8').split(/\r?\n\r?\n/)

    const board = new Map()
    sections[0].split(/\r?\n/).forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === '.') {
                board.set(`${x},${y}`, TILE)
            } else if (char === '#') {
                board.set(`${x},${y}`, WALL)
            }
        })
    })

    const moves = sections[1].replace(/([RL])/g, ' $1 ').split(' ').map(val => { return isNaN(val) ? val : parseInt(val) })

    return { board, moves }
}

// gives the coordinates as they would be if the face was rotated and moved
function getRotatedCoordinate(x, y, faceSize, count, offset) {
    // normalize x and y to the face
    x = x % faceSize
    y = y % faceSize

    // rotate the coordinates to orient to the new face
    for (let i = 0; i < count; i++) {
        const newX = faceSize - y - 1
        const newY = x
        x = newX
        y = newY
    }
    // place the coordinates adjacent to the new face
    return { x: x + offset[0], y: y + offset[1] }
}

function getExtremes(board) {
    const x = [...board.keys()].map(key => parseInt(key.split(',')[0]))
    const y = [...board.keys()].map(key => parseInt(key.split(',')[1]))

    return {
        minX: Math.min(...x),
        maxX: Math.max(...x),
        minY: Math.min(...y),
        maxY: Math.max(...y)
    }
}

function printBoard(board) {
    const { minX, maxX, minY, maxY } = getExtremes(board)
    for (let y = minY; y <= maxY; y++) {
        let line = ''
        for (let x = minX; x <= maxX; x++) {
            line += board.get(`${x},${y}`) || ' '
        }
        console.log(line)
    }
}

function nextWrappedPosition(position, direction, board) {
    const possibilities = [...board.keys()].filter(key => {
        return key.split(',')[(direction + 1) % 2] === `${position[(direction + 1) % 2]}`
    }).map(key => parseInt(key.split(',')[(direction) % 2]))

    const next = direction < 2 ? Math.min(...possibilities) : Math.max(...possibilities)
    const newPosition = [...position]
    newPosition[(direction) % 2] = next

    if (board.get(`${newPosition[0]},${newPosition[1]}`) !== WALL)
        return `${newPosition[0]},${newPosition[1]}`

    return `${position[0]},${position[1]}`
}

function moveInDirection(board, currentPoint, direction, steps, faceSize) {
    let xVector = Math.round(Math.cos((direction) * Math.PI / 2))
    let yVector = Math.round(Math.sin((direction) * Math.PI / 2))
    const originalDirection = direction

    let newPoint = currentPoint
    for (let i = 1; i <= steps; i++) {
        const [x, y] = newPoint.split(',').map(Number)

        let possiblePoint = `${x + xVector},${y + yVector}`
        let newDirection = direction
        let newXVector = xVector
        let newYVector = yVector
        // for a cube, need to figure out if we are crossing a face
        if (Math.floor(x / faceSize) !== Math.floor((x + xVector) / faceSize) || Math.floor(y / faceSize) !== Math.floor((y + yVector) / faceSize)) {
            let currentFace = FACES[Math.floor(y / faceSize)][Math.floor(x / faceSize)]
            let newFaceActions = FACE_ACTIONS.get(currentFace)[direction]

            // rotate and offset the current point to place it adjacent to the new face 
            // (may already be adjacent, but this will work either way)
            let teleportCoords = getRotatedCoordinate(x, y, faceSize, newFaceActions.directionChange, newFaceActions.offset)

            newDirection = (newDirection + newFaceActions.directionChange) % 4
            newXVector = Math.round(Math.cos((newDirection) * Math.PI / 2))
            newYVector = Math.round(Math.sin((newDirection) * Math.PI / 2))
            possiblePoint = `${teleportCoords.x + newXVector},${teleportCoords.y + newYVector}`
        }

        if (board.has(possiblePoint)) {
            // blocked by wall
            if (board.get(possiblePoint) === WALL) {
                possiblePoint = newPoint
            } else {
                direction = newDirection
                xVector = newXVector
                yVector = newYVector
            }
        } else {
            // wrap around
            possiblePoint = nextWrappedPosition([x, y], direction, board)
        }
        board.set(newPoint, PATH_DECORATORS[direction])

        // blocked
        if (possiblePoint === newPoint) {
            break
        }
        newPoint = possiblePoint
    }

    if (newPoint !== currentPoint)
        board.set(currentPoint, PATH_DECORATORS[originalDirection])

    return { newPoint, direction }
}

function changeDirection(direction, turn) {
    const newDirection = (direction + (turn === 'R' ? 1 : -1)) % 4
    return newDirection < 0 ? newDirection + 4 : newDirection
}

function findStartingPoint(board) {
    const startingX = [...board.entries()].reduce((minX, [key, value]) => {
        if (value === TILE && key.split(',')[1] === '0' && parseInt(key.split(',')[0]) < minX)
            return parseInt(key.split(',')[0])
        return minX
    }, Infinity)
    return `${startingX},0`
}

function followDirections(board, moves, faceSize, isDebugEnabled) {
    let currentPoint = findStartingPoint(board)
    let currentDirection = 0

    for (let move of moves) {
        if (move === 'L' || move === 'R') {
            const from = PATH_DECORATORS[currentDirection]
            currentDirection = changeDirection(currentDirection, move)
            if (isDebugEnabled) console.log(`Turning ${move} at ${currentPoint} from ${from} to ${PATH_DECORATORS[currentDirection]}`)
        } else {
            const from = currentPoint
            const newDetails = moveInDirection(board, currentPoint, currentDirection, move, faceSize)
            currentPoint = newDetails.newPoint
            currentDirection = newDetails.direction
            if (isDebugEnabled) console.log(`Moving ${move}${PATH_DECORATORS[currentDirection]} ${from} to ${currentPoint}`)
        }
    }

    if (isDebugEnabled) printBoard(board)

    return {
        row: parseInt(currentPoint.split(',')[1]) + 1,
        column: parseInt(currentPoint.split(',')[0]) + 1,
        direction: currentDirection
    }
}

const inputType = 'input'
const input = getInput(inputType)
const isDebugEnabled = inputType === 'sample'
let finalLocation = followDirections(new Map([...input.board.entries()]), input.moves, Infinity, isDebugEnabled)
let finalPassword = 1000 * finalLocation.row + 4 * finalLocation.column + finalLocation.direction
let expected = inputType === 'input' ? 64256 : 6032

console.log(`Answer for part 1: ${finalPassword}`)
if (finalPassword !== expected) throw new Error(`Expected ${expected} but got ${finalPassword}`)

if (inputType === 'sample') {
    FACES = SAMPLE_FACES
    FACE_ACTIONS = SAMPLE_FACE_ACTIONS
    FACE_SIZE = SAMPLE_FACE_SIZE
}
finalLocation = followDirections(new Map([...input.board.entries()]), input.moves, FACE_SIZE, isDebugEnabled)
finalPassword = 1000 * finalLocation.row + 4 * finalLocation.column + finalLocation.direction
expected = inputType === 'input' ? 109224 : 5031
console.log(`Answer for part 2: ${finalPassword}`)
if (finalPassword !== expected) throw new Error(`Expected ${expected} but got ${finalPassword}`)
