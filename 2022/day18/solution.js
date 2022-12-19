const fs = require('fs')
const cubes = new Set(fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/))

const answerPart1 = Array.from(cubes).reduce((surfaceArea, row) => {
    const cube = row.split(',').map(Number)
    for (direction of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const neighbor = `${cube[0] + direction[0]},${cube[1] + direction[1]},${cube[2] + direction[2]}`
        if (!cubes.has(neighbor)) surfaceArea++
    }
    return surfaceArea
}, 0)

console.log(`Answer part 1: ${answerPart1}`)
