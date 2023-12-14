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

function rotate(input, direction) {
  const output = [];
  if (direction === 'counterclockwise') {

    for (let i = input[0].length - 1; i >= 0; i--) {
      let column = '';
      for (let j = 0; j < input.length; j++) {
        column += input[j].substr(i, 1);
      }
      output.push(column);
    }
  } else {
    for (let i = 0; i < input[0].length; i++) {
      let column = '';
      for (let j = input.length - 1; j >= 0; j--) {
        column += input[j].substr(i, 1);
      }
      output.push(column);
    }
  }
  return output;
}

// rotate the input 90 degrees counter-clockwise
const northerly = rotate(input, 'counterclockwise');

// collapse the input to the left/north
northerly.forEach((line, index) => {
  let newLine = line.replace(/([.]+)O/g, 'O$1');
  while (newLine !== line) {
    line = newLine;
    newLine = line.replace(/([.]+)O/g, 'O$1');
  }

  northerly[index] = newLine;
});

const upsideDown = rotate(northerly, 'counterclockwise');

let part1 = upsideDown.reduce((sum, line, index) => {
  const regex = /O/g;
  const stones = regex.test(line) ? line.match(/[O]/g).length : 0;
  const weight = index + 1;
  return sum + (stones * weight);
}, 0);

let part2 = 0;

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 136)`);
  assert(part1 === 136);
} else {
  console.log(`Answer for part 1: ${part1} (should be 105784)`);
  assert(part1 === 105784);
}