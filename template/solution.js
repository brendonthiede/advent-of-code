const sampleInput = `${__dirname}/sample.txt`
const puzzleInput = `${__dirname}/input.txt`
const currentInput = sampleInput

fs = require('fs');
const rows = fs.readFileSync(currentInput, 'utf8').split(/\r?\n/)



console.log(`Answer for part 1: ${"?"}    (Should be ? for the sample, ? for the puzzle)`)

console.log(`Answer for part 2: ${"?"}    (Should be ? for the sample, ? for the puzzle)`)

if (currentInput === sampleInput) {
    console.log("\n!!! USING SAMPLE INPUT !!!")
}
