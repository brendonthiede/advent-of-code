fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map(Number)

console.log("Answer for part 1: " + inputs.reduce((a, b) => a + b, 0))
const history = [0]
let frequency = 0
let found = false
while (found === false) {
    inputs.forEach((val, index) => {
        frequency += val
        if (history.indexOf(frequency) > -1) {
            inputs.splice(index)
            found = true
        }
        history.push(frequency)
    })
}

console.log("Answer for part 2: " + frequency)
