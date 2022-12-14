fs = require('fs')

const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.split(' -> ').map((val) => val.split(',').map(Number)))

const extremes = inputs.reduce((extremes, line) => {
    line.forEach((val) => {
        if (val[0] < extremes.leftMost) {
            extremes.leftMost = val[0]
        } else if (val[0] > extremes.rightMost) {
            extremes.rightMost = val[0]
        }
        if (val[1] < extremes.top) {
            extremes.top = val[1]
        } else if (val[1] > extremes.bottom) {
            extremes.bottom = val[1]
        }
    })
    return extremes
}, { leftMost: Infinity, rightMost: 0, top: Infinity, bottom: 0 })

function initializeCave(inputs, extremes) {
    const cave = []
    for (let y = 0; y <= extremes.bottom + 3; y++) {
        cave[y] = []
        for (let x = extremes.leftMost - 1; x <= extremes.rightMost; x++) {
            cave[y][x] = '.'
        }
    }
    cave[0][500] = '+'
    inputs.forEach((line) => {
        line.forEach((val, index) => {
            if (index > 0) {
                const prev = line[index - 1]
                for (let x = prev[0]; true; x += x < val[0] ? 1 : -1) {
                    for (let y = prev[1]; true; y += y < val[1] ? 1 : -1) {
                        cave[y][x] = '#'
                        if (y === val[1]) break
                    }
                    if (x === val[0]) break
                }
            }
        })
    })

    return cave
}

function drawCave(cave) {
    cave.forEach((line) => {
        console.log(line.join(''))
    })
    console.log("")
}

const cave = initializeCave(inputs, extremes)
console.log("Initial state:")
drawCave(cave)

let outOfBounds = false
let sandGrains = 0
while (!outOfBounds) {
    let position = [500, 0]
    while (true) {
        try {
            if (position[1] > extremes.bottom || position[0] < extremes.leftMost || position[0] > extremes.rightMost) {
                sandGrains--
                outOfBounds = true
                break
            }
            if (cave[position[1] + 1][position[0]] === '.') {
                position[1]++
            } else if (cave[position[1] + 1][position[0] - 1] === '.') {
                position[1]++
                position[0]--
            } else if (cave[position[1] + 1][position[0] + 1] === '.') {
                position[1]++
                position[0]++
            } else {
                cave[position[1]][position[0]] = '0'
                break
            }
        } catch (error) {
            console.log(error)
        }

    }

    sandGrains++
    if ([1, 2, 5, 22, 24].indexOf(sandGrains) > -1) {
        drawCave(cave)
    }
}

console.log(`Answer for part 1: ${sandGrains}`)