function canMove(currentRock, rockX, rockY, chamber, dx, dy) {
    if (rockX + dx < 0 || rockX + dx + currentRock[0].length > 7) {
        return false
    }

    for (let y = 0; y < currentRock.length; y++) {
        if (rockY - y + dy < 0) return false
        for (let x = 0; x < currentRock[y].length; x++) {
            if (currentRock[y][x] === '#' && chamber.has(`${rockX + x + dx},${rockY - y + dy}`)) return false
        }
    }

    return true
}

function dropRocks(jets, rocks, numberOfRocks) {
    let chamber = new Set()
    let rockCount = 0
    let currentRockIndex = 0
    let jetIndex = 0
    let overallIncrease = 0
    const stoneAge = new Map()

    let highest = 0
    while (rockCount < numberOfRocks) {
        const currentRock = rocks[currentRockIndex]
        let rockX = 2
        let rockY = highest + 2 + currentRock.length

        let hitRockBottom = false
        while (!hitRockBottom) {
            let dx = (jets[jetIndex] == '>') ? 1 : -1

            if (canMove(currentRock, rockX, rockY, chamber, dx, 0)) rockX += dx
            if (!canMove(currentRock, rockX, rockY, chamber, 0, -1)) hitRockBottom = true

            rockY--
            jetIndex = (jetIndex + 1) % jets.length
        }

        for (let y = 0; y < currentRock.length; y++) {
            for (let x = 0; x < currentRock[y].length; x++) {
                if (currentRock[y][x] === '#') chamber.add(`${rockX + x},${rockY + 1 - y}`)
            }
        }

        const chamberShape = []
        for (let y = highest + 1; y >= highest - 50; y--) {
            let row = ''
            for (let x = 0; x < 7; x++) {
                // am I wearing a hat? then I don't matter
                if (chamber.has(`${x},${y}`)) {
                    if (chamber.has(`${Math.max(x, 1) - 1},${y}`) &&
                        chamber.has(`${x},${y + 1}`) &&
                        chamber.has(`${Math.min(x, 5) + 1},${y}`)) {
                        row += '.'
                    } else {
                        row += '#'
                    }
                } else {
                    row += '.'
                }
            }
            // ignore empty rows and stop on the first full row
            if (row === '.......') {
                continue
            } else if (row === '#######') {
                break
            }
            chamberShape.push(row)
        }

        const historyKey = [jetIndex, currentRockIndex, ...chamberShape].join(';')

        highest = Math.max(...Array.from(chamber)
            .map(val => val.split(',')[1])
            .map(Number).concat([-1])) + 1
        if (stoneAge.has(historyKey)) {
            const history = stoneAge.get(historyKey)
            const rockIncrease = rockCount - history.rockCount
            const heightIncrease = highest - history.height

            const size = Math.floor(((numberOfRocks - history.rockCount) / rockIncrease) - 1)
            overallIncrease += size * heightIncrease
            rockCount += size * rockIncrease
        } else {
            stoneAge.set(historyKey, { height: highest, rockCount })
        }
        rockCount++
        currentRockIndex = (currentRockIndex + 1) % rocks.length
    }

    return overallIncrease + highest
}

const fs = require('fs')
const rocks = fs.readFileSync(`${__dirname}/rocks.txt`, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(line => line.split(/\r?\n/).map(row => row.split('')))
const jets = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')

console.log(`${dropRocks(jets, rocks, 2022)}`)
console.log(`${dropRocks(jets, rocks, 1000000000000)}`)
