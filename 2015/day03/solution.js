const MOVES = {
    '>': { x: 1, y: 0 },
    '<': { x: -1, y: 0 },
    '^': { x: 0, y: -1 },
    'v': { x: 0, y: 1 },
}

fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('')

function getVisitations(input) {
    let x = 0
    let y = 0
    const visited = new Set()
    visited.add(`${x},${y}`)
    for (let i = 0; i < input.length; i++) {
        const move = MOVES[input[i]]
        x += move.x
        y += move.y
        visited.add(`${x},${y}`)
    }
    return visited
}

function getAlternatingVisitations(input) {
    let santaX = 0
    let santaY = 0
    let roboX = 0
    let roboY = 0
    const visited = new Set()
    visited.add(`${santaX},${santaY}`)
    for (let i = 0; i < input.length; i++) {
        const move = MOVES[input[i]]
        if (i % 2 === 0) {
            santaX += move.x
            santaY += move.y
            visited.add(`${santaX},${santaY}`)
        } else {
            roboX += move.x
            roboY += move.y
            visited.add(`${roboX},${roboY}`)
        }
    }
    return visited
}

console.log("Answer for part 1: " + getVisitations(inputs).size)
console.log("Answer for part 2: " + getAlternatingVisitations(inputs).size)
