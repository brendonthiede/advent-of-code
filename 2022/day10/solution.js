fs = require('fs')

instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/)

const crt = Array(6).fill(0).map(() => Array(40).fill(' '))
const signalStrengths = []

let cycles = 0
let x = 1
instructions.forEach(instruction => {
    let increment = 0
    let cyclesPassed = 0
    if (instruction === 'noop') {
        cyclesPassed = 1
    } else {
        increment = Number(instruction.split(' ')[1])
        cyclesPassed = 2
    }
    for (let i = 0; i < cyclesPassed; i++) {
        const cycleRow = Math.floor((cycles) / 40)
        const cycleColumn = cycles % 40
        if (cycleColumn >= x - 1 && cycleColumn <= x + 1) {
            crt[cycleRow][cycles % 40] = '█'
        }
        cycles++
        if (cycles === 20 || (cycles - 20) % 40 === 0) {
            signalStrengths.push({ cycle: cycles, x: x, strength: x * cycles })
        }
    }
    x += increment
});

console.log(`Answer for part 1: ${signalStrengths.reduce((acc, signalStrength) => acc + signalStrength.strength, 0)}`)

console.log('Answer for part 2:')
crt.forEach((row) => {
    console.log(row.join(''))
})
