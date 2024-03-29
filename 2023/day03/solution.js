fs = require('fs');

let input = [];
let total = 0;

function reset() {
    input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
        .split(/\r?\n/)
        .map(line => line.split(''));

    total = 0;
}

function pullNumber(row, col) {
    // find the start of the number
    let startCol = col;
    while (startCol > 0 && input[row][startCol - 1].match(/\d/)) {
        startCol--;
    }
    // find the end of the number
    let endCol = col;
    while (endCol < input[row].length && ("" + input[row][endCol + 1]).match(/\d/)) {
        endCol++;
    }

    // extract each digit and concatenate them and replace the original with a . (dot) to avoid duplicate usage
    let number = "";
    for (let i = startCol; i <= endCol; i++) {
        number += input[row][i];
        input[row][i] = '.';
    }
    return parseInt(number);
}

reset();
for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
        // find non-numbers that are also not . (dot)
        if (!input[row][col].match(/[0-9.]/)) {
            // then look in all directions for a number
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (row + i < 0 || row + i >= input.length || col + j < 0 || col + j >= input[row].length) {
                        continue;
                    }
                    if (input[row + i][col + j].match(/\d/)) {
                        total += pullNumber(row + i, col + j);
                    }
                }
            }
        }
    }
}

const part1 = total;

reset();
for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
        // look explicitly for * this time
        if (input[row][col] === '*') {
            const numbers = [];
            // look in all directions for a number
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    // if the cell is out of bounds, skip it
                    if (row + i < 0 || row + i >= input.length || col + j < 0 || col + j >= input[row].length) {
                        continue;
                    }
                    // if the cell is a number, print it
                    if (input[row + i][col + j].match(/\d/)) {
                        numbers.push(pullNumber(row + i, col + j));
                    }
                }
            }
            // verify that we found exactly 2 numbers
            if (numbers.length === 2) {
                total += numbers[0] * numbers[1];
            }
        }
    }
}

const part2 = total;

console.log(`Answer for part 1: ${part1}`);
console.log(`Answer for part 2: ${part2}`);
