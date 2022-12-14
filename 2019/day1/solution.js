fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map(Number)

console.log("Answer for part 1: " + inputs.reduce((a, b) => a + (Math.floor(b / 3) - 2), 0))
console.log("Answer for part 2: " + inputs.reduce((a, b) => {
    let fuel = Math.floor(b / 3) - 2
    while (fuel > 0) {
        a += fuel
        fuel = Math.floor(fuel / 3) - 2
    }
    return a
}, 0))
