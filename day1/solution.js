fs = require('fs');
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n\r?\n/)
    .map(val => val.split(/\r?\n/).map(Number).reduce((a, b) => a + b, 0))
    .sort((a, b) => b - a);

console.log("Answer for part 1: " + inputs[0])
console.log("Answer for part 2: " + inputs.slice(0, 3).reduce((a, b) => a + b, 0))
