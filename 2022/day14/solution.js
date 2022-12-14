fs = require('fs')

const inputs = fs.readFileSync(`${__dirname}/sample.txt`, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.split(' -> ').map((val) => val.split(',').map(Number)))

const extremes = inputs.reduce((extremes, line) => {
    line.forEach((val) => {
        const x = val[0]
        const y = val[1]
        if (x < extremes.leftMost) {
            extremes.leftMost = x
        }
        if (x > extremes.rightMost) {
            extremes.rightMost = x
        }
        if (y < extremes.top) {
            extremes.top = y
        }
        if (y > extremes.bottom) {
            extremes.bottom = y
        }
    })
    return extremes
}, { leftMost: Infinity, rightMost: 0, top: Infinity, bottom: 0 })


const walls = new Set()
const sand = new Set()

inputs.forEach((line) => {
    line.forEach((val, index) => {
        if (index > 0) {
            const prev = line[index - 1]
            for (let x = prev[0]; true; x += x < val[0] ? 1 : -1) {
                for (let y = prev[1]; true; y += y < val[1] ? 1 : -1) {
                    walls.add([x, y].toString())
                    if (y === val[1]) break
                }
                if (x === val[0]) break
            }
        }
    })
})

function printCave() {
    const newExtremes = {
        leftMost: extremes.leftMost,
        rightMost: extremes.rightMost,
        top: extremes.top,
        bottom: extremes.bottom
    }

    sand.forEach((val) => {
        const [x, y] = val.split(',').map(Number)
        if (x < newExtremes.leftMost) {
            newExtremes.leftMost = x
        }
        if (x > newExtremes.rightMost) {
            newExtremes.rightMost = x
        }
        if (y < newExtremes.top) {
            newExtremes.top = y
        }
        if (y > newExtremes.bottom) {
            newExtremes.bottom = y
        }
    })

    for (let y = newExtremes.top; y <= newExtremes.bottom; y++) {
        let row = ''
        for (let x = newExtremes.leftMost; x <= newExtremes.rightMost; x++) {
            if (walls.has([x, y].toString())) {
                row += '#'
            } else if (sand.has([x, y].toString())) {
                row += 'O'
            } else {
                row += '.'
            }
        }
        console.log(row)
    }
}

function grainsPossible(hasFloor) {
    while (true) {
        let position = [500, 0]
        while (true) {
            if (position[1] > extremes.bottom + 1) {
                return sand.size
            }
            // when there is a floor
            if (hasFloor) {
                if (position[1] > extremes.bottom) {
                    sand.add([position[0], position[1]].toString())
                    break
                }
                if (sand.has([500, 1].toString()) && sand.has([499, 1].toString()) && sand.has([501, 1].toString())) {
                    sand.add('500,0')
                    return sand.size
                }
            }

            if (!walls.has([position[0], position[1] + 1].toString()) && !sand.has([position[0], position[1] + 1].toString())) {
                position[1]++
            } else if (!walls.has([position[0] - 1, position[1] + 1].toString()) && !sand.has([position[0] - 1, position[1] + 1].toString())) {
                position[1]++
                position[0]--
            } else if (!walls.has([position[0] + 1, position[1] + 1].toString()) && !sand.has([position[0] + 1, position[1] + 1].toString())) {
                position[1]++
                position[0]++
            } else {
                sand.add([position[0], position[1]].toString())
                break
            }
        }
    }
}

console.log(`Answer for part 1: ${grainsPossible(false)}`)
console.log(`Answer for part 2: ${grainsPossible(true)}`)
