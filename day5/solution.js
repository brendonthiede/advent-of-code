fs = require('fs')

// Separate the input into Setup and Actions (top and bottom)
const sections = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n\r?\n/).map(val => val.split(/\r?\n/))

// convert the Setup into stacks
const setup = sections[0] //.map(val => val.split(/\r?\n/))
const stackCount = setup[setup.length - 1].split(' ').map(Number).sort((a, b) => b - a)[0]
const stacks = Array(stackCount).fill(0).map(x => Array(0))

for (let row = setup.length - 2; row >= 0; row--) {
    for (let stack = 0; stack < stackCount; stack++) {
        const letter = setup[row][1 + 4 * stack]
        if (letter != ' ') {
            stacks[stack].push(letter)
        }
    }
}

// execute instructions
const instructions = sections[1].map(val => {
    const parts = val.split(' ')
    return {
        quantity: Number(parseInt(parts[1])),
        from: Number(parseInt(parts[3])),
        to: Number(parseInt(parts[5])),
    }
})

for (let instruction of instructions) {

    const fromStack = stacks[instruction.from - 1]
    const toStack = stacks[instruction.to - 1]
    for (let index = 0; index < instruction.quantity; index++) {
        toStack.push(fromStack.pop())
    }
}

const topBoxes = stacks.reduce((cumulative, stack) => cumulative + stack[stack.length - 1], '')
console.log("Answer for part 1: " + topBoxes)