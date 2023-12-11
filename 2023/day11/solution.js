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
  .split(/\r?\n/)
  .map(line => line.split(''));

const rowsWithGalaxies = [];
const columnsWithGalaxies = [];
const galaxies = [];

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (input[y][x] === '#') {
      rowsWithGalaxies.push(y);
      columnsWithGalaxies.push(x);
    }
  }
}

for (let y = input.length - 1; y >= 0; y--) {
  for (let x = input[y].length - 1; x >= 0; x--) {
    if (!columnsWithGalaxies.includes(x)) {
      input[y].splice(x, 0, '.');
    }
  }
  if (!rowsWithGalaxies.includes(y)) {
    input.splice(y, 0, input[y].slice());
  }
}

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    if (input[y][x] === '#') {
      galaxies.push({ x, y });
    }
  }
}

let totalDistance = 0;
for (let i = 0; i < galaxies.length - 1; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    const distance = Math.abs(galaxies[i].x - galaxies[j].x) + Math.abs(galaxies[i].y - galaxies[j].y);
    totalDistance += distance;
  }
}

if (DEBUG) {
  input.forEach(row => console.log(row.join('')));
}

const part1 = totalDistance;
const part2 = 0;

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 374)`);
  assert(part1 === 374);
} else {
  console.log(`Answer for part 1: ${part1} (should be 10033566)`);
  assert(part1 === 10033566);
}