fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map(Number)

console.log(`Answer for part 1: ${inputs.reduce((acc, val, index) => index > 0 && val > inputs[index - 1] ? acc + 1 : acc, 0)}`)
console.log(`Answer for part 2: ${inputs.reduce((acc, val, index) => index > 2 && val > inputs[index - 3] ? acc + 1 : acc, 0)}`)
