fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('').map(Number)

function matchingValues(inputs, offset = 1) {
    return inputs.map((val, index) => {
        const nextIndex = (index + offset) % inputs.length
        return val === inputs[nextIndex] ? val : 0
    })
}

function matchingSum(inputs, offset = 1) {
    return matchingValues(inputs, offset).reduce((a, b) => a + b, 0)
}

console.log("Answer for part 1: " + matchingSum(inputs, 1))
console.log("Answer for part 2: " + matchingSum(inputs, inputs.length / 2))
