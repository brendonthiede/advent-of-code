fs = require('fs')
const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')

function locationOf(character) {
    return grid.reduce((acc, row, y) => {
        const x = row.indexOf(character.charCodeAt(0))
        return x >= 0 ? { x, y } : acc
    }, { x: 0, y: 0 })
}

function possibleMoves(position, grid, visited = []) {
    const options = []
    for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
            // ignore diagonals
            if (Math.abs(dy) === Math.abs(dx)) continue
            // ignore out of bounds
            if (position.x + dx < 0 || position.x + dx >= grid[0].length ||
                position.y + dy < 0 || position.y + dy >= grid.length) continue
            // ignore already visited
            if (visited.includes(`${position.x + dx},${position.y + dy}`)) continue
            // ignore if the elevation change is too great
            if (grid[position.y + dy][position.x + dx] - grid[position.y][position.x] > 1) continue

            options.push({ x: position.x + dx, y: position.y + dy })
        }
    }
    return options
}

function shortestPath(start, finish, grid) {
    let finalPath = []

    const possibilities = [[start]]
    const visited = [`${start.x},${start.y}`]

    while (possibilities.length > 0 && finalPath.length == 0) {
        let path = possibilities.shift()
        let position = path[path.length - 1]

        possibleMoves(position, grid, visited).forEach((move) => {
            if (move.x == finish.x && move.y == finish.y) finalPath = path.concat([finish])
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

const shortestPathFromS = shortestPath(start, finish, grid)

console.log(`Answer for part 1: ${shortestPathFromS}`)

const part2Paths = [shortestPathFromS]
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'a'.charCodeAt(0)) {
            const path = shortestPath({ x, y }, finish, grid)
            if (path > 0) part2Paths.push(path)
        }
    }
}

console.log(`Answer for part 2: ${Math.min(...part2Paths)}`)