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

function moveTail(previousTail, currentTail) {
    if (Math.abs(previousTail.x - currentTail.x) > 1 && Math.abs(previousTail.y - currentTail.y) > 1) {
        currentTail.x += previousTail.x > currentTail.x ? 1 : -1
        currentTail.y += previousTail.y > currentTail.y ? 1 : -1
    } else if (Math.abs(previousTail.x - currentTail.x) > 1) {
        currentTail.x += previousTail.x > currentTail.x ? 1 : -1
        currentTail.y = previousTail.y
    } else if (Math.abs(previousTail.y - currentTail.y) > 1) {
        currentTail.y += previousTail.y > currentTail.y ? 1 : -1
        currentTail.x = previousTail.x
    }
}

function getVisited(tailLength) {
    const visited = new Set()
    visited.add('0,0')
    const positions = Array(tailLength + 1).fill(0).map(() => { return { x: 0, y: 0 } })
    
    movements.forEach(movement => {
        for (let i = 0; i < movement.distance; i++) {
            positions[0].x += movement.direction === 'R' ? 1 : movement.direction === 'L' ? -1 : 0
            positions[0].y += movement.direction === 'U' ? 1 : movement.direction === 'D' ? -1 : 0

            for (let index = 1; index < positions.length; index++) {
                moveTail(positions[index - 1], positions[index])
            }
            visited.add(`${positions[positions.length - 1].x},${positions[positions.length - 1].y}`)
        }
    })

    return visited.size
}

console.log(`Answer for part 1: ${getVisited(1)}`)
console.log(`Answer for part 2: ${getVisited(9)}`)
