fs = require('fs');
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split("\n").map(Number);

const allElves = []
let currentCalories = 0
for (i = 0; i <= inputs.length; i++) {
    if (i == inputs.length || inputs[i] == 0) {
        allElves.push(currentCalories)
        currentCalories = 0
    } else {
        currentCalories += inputs[i]
    }
}

allElves.sort((a, b) => b - a )
console.log("Answer for part 1: " + allElves[0])

const topCalories = allElves.slice(0, 3).reduce((a, b) => a + b, 0)
console.log("Answer for part 2: " + topCalories)
