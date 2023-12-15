const { assert } = require('console');

fs = require('fs');

// check for optional command line argument
let defaultInputType = 'input';
let inputType = defaultInputType;
if (process.argv.length > 2) {
  inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (/sample.*/.test(inputType) || process.argv.length > 3) {
  DEBUG = true;
}

const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n/);

function tilt(input, direction) {
  const output = [];
  switch (direction) {
    case 'north':
      // gather each column into a line, so top is left, and collapse
      for (let charIndex = input[0].length - 1; charIndex >= 0; charIndex--) {
        let column = '';
        for (let rowIndex = 0; rowIndex < input.length; rowIndex++) {
          column += input[rowIndex].substr(charIndex, 1);
        }
        output.push(column);
      }
      collapse(output);
      // put the collapsed columns back into rows
      for (let charIndex = 0; charIndex < output[0].length; charIndex++) {
        let column = '';
        for (let rowIndex = output.length - 1; rowIndex >= 0; rowIndex--) {
          column += output[rowIndex].substr(charIndex, 1);
        }
        input[charIndex] = column;
      }
      break;
    case 'south':
      // gather each column into a line, so bottom is left, and collapse
      for (let charIndex = 0; charIndex < input[0].length; charIndex++) {
        let column = '';
        for (let rowIndex = input.length - 1; rowIndex >= 0; rowIndex--) {
          column += input[rowIndex].substr(charIndex, 1);
        }
        output.push(column);
      }
      collapse(output);
      // put the collapsed columns back into rows
      for (let charIndex = output[0].length - 1; charIndex >= 0; charIndex--) {
        let column = '';
        for (let rowIndex = 0; rowIndex < output.length; rowIndex++) {
          column += output[rowIndex].substr(charIndex, 1);
        }
        input[output.length - charIndex - 1] = column;
      }
      break;
    case 'east':
      // gather each row into a line, so right is left, and collapse
      input.forEach((line) => {
        output.push(line.split('').reverse().join(''));
      });
      collapse(output);
      // put the collapsed rows back into columns
      output.forEach((line, index) => {
        input[index] = line.split('').reverse().join('');
      });
      break;
    case 'west':
      collapse(input);
      break;
  }
}

function collapse(input) {
  // collapse the input to the left
  input.forEach((line, index) => {
    let newLine = line.replace(/([.]+)O/g, 'O$1');
    while (newLine !== line) {
      line = newLine;
      newLine = line.replace(/([.]+)O/g, 'O$1');
    }

    input[index] = newLine;
  });
}

function getWeight(input) {
  return input.reduce((sum, line, index) => {
    const regex = /O/g;
    const stones = regex.test(line) ? line.match(/[O]/g).length : 0;
    const weight = input.length - index;
    return sum + (stones * weight);
  }, 0);
}

function printWithWeight(input) {
  input.forEach((line, index) => {
    let weight = `   ${input.length - index}`
    weight.substring(weight.length - 3);
    console.log(`${line} ${weight}`);
  });
  console.log('\n\n');
}

const part1Input = input.slice(0);

if (DEBUG) {
  console.log('Before:');
  printWithWeight(part1Input);
}

tilt(part1Input, 'north');

if (DEBUG) {
  console.log('After:');
  printWithWeight(part1Input);
}

const part1 = getWeight(part1Input);

const directions = ['north', 'west', 'south', 'east'];
let part2Input = input.slice(0);
if (DEBUG) {
  console.log('Before:');
  printWithWeight(part2Input);
}

const history = [];

const numberOfCycles = 1000000000;
const totalTilts = numberOfCycles * directions.length;
let final = [];
for (let i = 0; i < totalTilts; i++) {
  let direction = directions[i % directions.length];
  tilt(part2Input, direction);
  let current = `${direction}|${part2Input.join('|')}`;
  let cycleStart = history.indexOf(current);
  history.push(current);
  if (cycleStart >= 0) {
    const cycleLength = i - cycleStart;
    const remainingTilts = totalTilts - i;
    const finalPosition = cycleStart + (remainingTilts % cycleLength) - 1;
    final = history[finalPosition].split('|');
    break;
  }
}

const part2 = getWeight(final);

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 136)`);
  assert(part1 === 136);
  console.log(`Answer for part 2: ${part2} (should be 64)`);
  assert(part2 === 64);
} else {
  console.log(`Answer for part 1: ${part1} (should be 105784)`);
  assert(part1 === 105784);
  console.log(`Answer for part 2: ${part2} (should be 91286)`);
  assert(part2 === 91286);
}