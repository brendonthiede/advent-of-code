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
        const newHeights = new Set()
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

        let state = `${jetIndex};${currentRockIndex};`
        const chamberTop = []
        for (let y = highest; y >= highest - 8; y--) {
            let row = ''
            for (let x = 0; x < 7; x++) row += chamber.has(`${x},${y}`) ? '#' : '.'
            chamberTop.push(row)
        }
        state += chamberTop.join(';')


        highest = Math.max(...Array.from(chamber)
            .map(val => val.split(',')[1])
            .map(Number).concat([-1])) + 1
        if (stoneAge.has(state)) {
            const history = stoneAge.get(state)
            const rockIncrease = rockCount - history.rockCount
            const heightIncrease = highest - history.height

            const size = Math.floor(((numberOfRocks - history.rockCount) / rockIncrease) - 1)
            overallIncrease += size * heightIncrease
            rockCount += size * rockIncrease
        } else {
            stoneAge.set(state, { height: highest, rockCount })
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
