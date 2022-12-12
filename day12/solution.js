fs = require('fs')
const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')

function locationOf(character) {
    return grid.reduce((acc, row, y) => {
        const x = row.indexOf(character.charCodeAt(0))
        return x >= 0 ? { x, y } : acc
    }, { x: 0, y: 0 })
}

function possibleMoves(position, grid, visited = []) {
    // up down left right
    return [{ x: position.x, y: position.y - 1 }, { x: position.x, y: position.y + 1 }, { x: position.x - 1, y: position.y }, { x: position.x + 1, y: position.y }]
        .filter((newPosition) => {
            return (
                // ignore out of bounds
                newPosition.x >= 0 && newPosition.x < grid[0].length &&
                newPosition.y >= 0 && newPosition.y < grid.length &&
                // ignore too steep
                grid[position.y][position.x] - grid[newPosition.y][newPosition.x] <= 1 &&
                // ignore already visited
                !visited.includes(`${newPosition.x},${newPosition.y}`)
            )
        })

}

function shortestPath(startValue, finish, grid) {
    let finalPath = []

    const possibilities = [[finish]]
    const visited = [`${finish.x},${finish.y}`]

    while (possibilities.length > 0 && finalPath.length == 0) {
        let path = possibilities.shift()
        let position = path[path.length - 1]

        possibleMoves(position, grid, visited).forEach((move) => {
            if (grid[move.y][move.x] === startValue) finalPath = path.concat([finish])
            visited.push(`${move.x},${move.y}`)
            possibilities.push(path.concat([move]))
        })
    }

    return finalPath.length - 1
}

const grid = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/)
    .map(raw => raw.split('').map(char => char.charCodeAt(0)))

const start = locationOf('S')
const finish = locationOf('E')

//set start and end elevation
grid[start.y][start.x] = 'a'.charCodeAt(0) - 1
grid[finish.y][finish.x] = 'z'.charCodeAt(0) + 1

const shortestPathFromS = shortestPath('a'.charCodeAt(0) - 1, finish, grid)
console.log(`Answer for part 1: ${shortestPathFromS}`)

const shortestPathFromA = shortestPath('a'.charCodeAt(0), finish, grid)
console.log(`Answer for part 2: ${shortestPathFromA}`)
