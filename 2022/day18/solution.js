function getUnblockedSurfaceArea(cubes) {
    return cubes.reduce((surfaceArea, row) => {
        const cube = row.split(',').map(Number)
        for (direction of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
            const neighbor = `${cube[0] + direction[0]},${cube[1] + direction[1]},${cube[2] + direction[2]}`
            if (!cubes.includes(neighbor)) surfaceArea++
        }
        return surfaceArea
    }, 0)
}

const fs = require('fs')
const cubes = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)

console.log(`Answer part 1: ${getUnblockedSurfaceArea(cubes)}`)
