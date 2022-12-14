fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(', ').map((val) => [val[0], parseInt(val.slice(1))])

const directions = {
    'N': { facing: 'N', x: 0, y: 1, R: 'E', L: 'W' },
    'E': { facing: 'E', x: 1, y: 0, R: 'S', L: 'N' },
    'S': { facing: 'S', x: 0, y: -1, R: 'W', L: 'E' },
    'W': { facing: 'W', x: -1, y: 0, R: 'N', L: 'S' }
}

const visited = ['0,0']
let realPosition = null

const finalPosition = inputs.reduce((a, b) => {
    const { facing, x, y } = a
    const [turn, distance] = b
    const movement = directions[directions[facing][turn]]
    if (!realPosition) {
        for (let i = 1; i <= distance; i++) {
            const checkX = x + (movement.x * i)
            const checkY = y + (movement.y * i)
            if (visited.indexOf(`${checkX},${checkY}`) > 0) {
                realPosition = { x: checkX, y: checkY }
            } else {
                visited.push(`${checkX},${checkY}`)
            }
        }        
    }
    return { facing: movement.facing, x: x + (movement.x * distance), y: y + (movement.y * distance) }
}, { facing: 'N', x: 0, y: 0 })


const blocks = Math.abs(finalPosition.x) + Math.abs(finalPosition.y)
console.log("Answer for part 1: " + blocks)

const realBlocks = Math.abs(realPosition.x) + Math.abs(realPosition.y)
console.log("Answer for part 2: " + realBlocks)
