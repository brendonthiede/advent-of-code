fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('').map((val) => val === '(' ? 1 : -1)

console.log("Answer for part 1: " + inputs.reduce((a, b) => a + b, 0))
const movesToBasement = inputs.reduce((a, b, index, arr) => {
    if (a + b === -1) {
        arr.splice(index)
        return index + 1
    }
   return a + b
}, 0)

console.log("Answer for part 2: " + movesToBasement)
