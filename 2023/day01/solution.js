fs = require('fs');
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/);

const part1 = inputs.map(line => line.replace(/\D/g, ''))
    .map(line => line.slice(0, 1) + line.slice(-1))
    .map(line => parseInt(line))
    .reduce((a, b) => a + b, 0);

function partTwoConversion(line) {
    const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let numberLine = "";
    for (let i = 0; i < line.length; i++) {
        if (line[i].match(/\d/)) {
            numberLine += line[i];
        } else {
            numberWords.forEach((word, index) => {
                if (line.slice(i, i + word.length) === word) {
                    numberLine += index;
                }
            });
        }
    }

    return numberLine;
}

const part2 = inputs
    .map(line => partTwoConversion(line))
   .map(line => line.slice(0, 1) + line.slice(-1))
   .map(line => parseInt(line))
   .reduce((a, b) => a + b, 0);

console.log("Answer for part 1: " + part1);
console.log("Answer for part 2: " + part2);
