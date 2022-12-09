fs = require('fs')

movements = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => {
        const pieces = line.split(' ')
        return {
            direction: pieces[0],
            distance: Number(pieces[1])
        }
    })

const headPosition = { x: 0, y: 0 }
const tailPosition = { x: 0, y: 0 }
const visited = new Set()
visited.add('0,0')

function printDebug(header) {
    console.log(header)
    for (let row = 4; row >= 0; row--) {
        let output = ''
        for (let col = 0; col <= 5; col++) {
            const pos = `${col},${row}`
            if (pos === `${headPosition.x},${headPosition.y}`) {
                output += 'H'
            } else if (pos === `${tailPosition.x},${tailPosition.y}`) {
                output += 'T'
            } else if (visited.has(pos)) {
                output += '#'
            } else {
                output += '.'
            }
        }
        console.log(output)
    }
}

movements.forEach(movement => {
    const { direction, distance } = movement
    const { x, y } = headPosition
    const { x: tx, y: ty } = tailPosition
    const dx = direction === 'R' ? 1 : direction === 'L' ? -1 : 0
    const dy = direction === 'U' ? 1 : direction === 'D' ? -1 : 0
    for (let i = 0; i < distance; i++) {
        headPosition.x += dx
        headPosition.y += dy

        if (Math.abs(headPosition.x - tailPosition.x) > 1) {
            tailPosition.x += dx
            tailPosition.y = headPosition.y
        }
        if (Math.abs(headPosition.y - tailPosition.y) > 1) {
            tailPosition.y += dy
            tailPosition.x = headPosition.x
        }
        visited.add(`${tailPosition.x},${tailPosition.y}`)
        // printDebug(`== ${direction} ${distance} ==`)
    }
})

console.log(`Answer for part 1: ${visited.size}`)
