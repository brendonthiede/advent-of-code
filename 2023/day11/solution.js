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
      galaxies.push({ x, y });
    }
  }
}

const emptyRows = [];
const emptyColumns = [];
for (let y = 0; y < input.length; y++) {
  if (!rowsWithGalaxies.includes(y)) {
    emptyRows.push(y);
  }
}

for (let x = 0; x < input[0].length; x++) {
  if (!columnsWithGalaxies.includes(x)) {
    emptyColumns.push(x);
  }
}

function getTotalDistance(galaxies, emptyRows, emptyColumns, expansionAmount) {
  let totalDistance = 0;
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const emptyColumnCount = emptyColumns.reduce((acc, col) => acc + (col > Math.min(galaxies[i].x, galaxies[j].x) && col < Math.max(galaxies[i].x, galaxies[j].x) ? 1 : 0), 0);
      const emptyRowCount = emptyRows.reduce((acc, row) => acc + (row > Math.min(galaxies[i].y, galaxies[j].y) && row < Math.max(galaxies[i].y, galaxies[j].y) ? 1 : 0), 0);
      const rowsBetween = Math.abs(galaxies[i].y - galaxies[j].y);
      const columnsBetween = Math.abs(galaxies[i].x - galaxies[j].x);
      totalDistance += columnsBetween + rowsBetween + (emptyRowCount + emptyColumnCount) * (expansionAmount - 1);
    }
  }
  return totalDistance;
}

if (DEBUG) {
  input.forEach(row => console.log(row.join('')));
}

const part1 = getTotalDistance(galaxies, emptyRows, emptyColumns, 2);

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 374)`);
  assert(part1 === 374);
  let answer = getTotalDistance(galaxies, emptyRows, emptyColumns, 10);
  console.log(`Answer for part 2a: ${answer} (should be 1030)`);
  assert(answer === 1030);
  answer = getTotalDistance(galaxies, emptyRows, emptyColumns, 100);
  console.log(`Answer for part 2b: ${answer} (should be 8410)`);
  assert(answer === 8410);
} else {
  console.log(`Answer for part 1: ${part1} (should be 10033566)`);
  assert(part1 === 10033566);
  let answer = getTotalDistance(galaxies, emptyRows, emptyColumns, 1000000);
  console.log(`Answer for part 2: ${answer} (should be 560822911938)`);
  assert(answer === 560822911938);
}