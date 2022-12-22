const TILE = '.'
const WALL = '#'
const PATH_DECORATORS = ['>', 'V', '<', '^']

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

function moveInDirection(board, currentPoint, direction, steps) {
    const xVector = Math.round(Math.cos((direction) * Math.PI / 2))
    const yVector = Math.round(Math.sin((direction) * Math.PI / 2))

    let newPoint = currentPoint
    for (let i = 1; i <= steps; i++) {
        const [x, y] = newPoint.split(',').map(Number)
        let possiblePoint = `${x + xVector},${y + yVector}`
        if (board.has(possiblePoint)) {
            // blocked by wall
            if (board.get(possiblePoint) === WALL) possiblePoint = newPoint
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
        board.set(currentPoint, PATH_DECORATORS[direction])

    return newPoint
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

function followDirections(board, moves, isCube, isDebugEnabled) {
    let currentPoint = findStartingPoint(board)
    let currentDirection = 0

    for (let move of moves) {
        if (move === 'L' || move === 'R') {
            const from = PATH_DECORATORS[currentDirection]
            currentDirection = changeDirection(currentDirection, move)
            if (isDebugEnabled) console.log(`Turning ${move} at ${currentPoint} from ${from} to ${PATH_DECORATORS[currentDirection]}`)
        } else {
            const from = currentPoint
            currentPoint = moveInDirection(board, currentPoint, currentDirection, move)
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

const Big = require('big.js')
Big.strict = true
Big.DP = 100
Big.NE = 100
Big.PE = 100

const inputType = 'input'
const input = getInput(inputType)

const finalLocation = followDirections(input.board, input.moves, false, inputType === 'sample')
const finalPassword = 1000 * finalLocation.row + 4 * finalLocation.column + finalLocation.direction

console.log(`Answer for part 1: ${finalPassword}`)

// console.log(`Answer for part 2: ${getHumnValue(new Map([...monkeys.entries()]))}`)
