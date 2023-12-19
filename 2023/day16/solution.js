const { readFileSync } = require('fs');
const { assert } = require('console');

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

const input = readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n/)
  .map(line => line.split(''));

const DIRECTIONS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

const NEXT_DIRECTIONS = {
  '.': {
    '-1,0': [DIRECTIONS.up],
    '1,0': [DIRECTIONS.down],
    '0,-1': [DIRECTIONS.left],
    '0,1': [DIRECTIONS.right],
  },
  '#': {
    '-1,0': [],
    '1,0': [],
    '0,-1': [],
    '0,1': [],
  },
  '\\': {
    '-1,0': [DIRECTIONS.left],
    '1,0': [DIRECTIONS.right],
    '0,-1': [DIRECTIONS.up],
    '0,1': [DIRECTIONS.down],
  },
  '/': {
    '-1,0': [DIRECTIONS.right],
    '1,0': [DIRECTIONS.left],
    '0,-1': [DIRECTIONS.down],
    '0,1': [DIRECTIONS.up],
  },
  '|': {
    '-1,0': [DIRECTIONS.up],
    '1,0': [DIRECTIONS.down],
    '0,-1': [DIRECTIONS.up, DIRECTIONS.down],
    '0,1': [DIRECTIONS.up, DIRECTIONS.down],
  },
  '-': {
    '-1,0': [DIRECTIONS.left, DIRECTIONS.right],
    '1,0': [DIRECTIONS.left, DIRECTIONS.right],
    '0,-1': [DIRECTIONS.left],
    '0,1': [DIRECTIONS.right],
  },
};

const singlePath = [];
const allPaths = [];

// just coming from 0, 0 to the right
singlePath.push([[0, 0, DIRECTIONS.right]]);

// all the paths from the edges coming in
for (let i = 0; i < input.length; i++) {
  allPaths.push([[i, 0, DIRECTIONS.right]]);
  allPaths.push([[i, input[0].length - 1, DIRECTIONS.left]]);
}
for (let i = 0; i < input[0].length; i++) {
  allPaths.push([[0, i, DIRECTIONS.down]]);
  allPaths.push([[input.length - 1, i, DIRECTIONS.up]]);
}

function getBeamLengths(paths) {
  const lengths = [];

  for (const path of paths) {
    const known = input.map((row) => row.map(() => []));
    while (path.length) {
      let [i, j, direction] = path.shift();
      // out of bounds, or already known
      if (!input[i] || !input[i][j] || known[i][j].includes(direction)) {
        continue;
      }

      known[i][j].push(direction);
      for (const nextDir of NEXT_DIRECTIONS[input[i][j]][direction]) {
        const [di, dj] = nextDir;
        path.push([i + di, j + dj, nextDir]);
      }
    }

    let beamEntryLocations = known.map((row) => row.map((entries) => entries.length > 0 ? 1 : 0));
    let rowCounts = beamEntryLocations.map((row) => row.reduce((acc, n) => acc + n, 0));
    let beamLength = rowCounts.reduce((acc, rowCount) => rowCount + acc, 0);
    lengths.push(beamLength);
  }

  return lengths;
}

const part1 = getBeamLengths(singlePath)[0];
const part2 = getBeamLengths(allPaths).reduce((acc, n) => Math.max(acc, n), 0);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 46,
      input: 7034
    }
  },
  part2: {
    actual: part2,
    expected: {
      sample: 51,
      input: 7759
    }
  }
};

let expectedPart1 = answers.part1.expected[inputType];
let expectedPart2 = answers.part2.expected[inputType];
console.log(`Answer for part 1: ${answers.part1.actual}`);
if (expectedPart1 !== null) {
  console.log(`        should be: ${expectedPart1}`);
  assert(answers.part1.actual === expectedPart1);
}

if (answers.part2.actual !== null) {
  console.log(`Answer for part 2: ${answers.part2.actual}`);
  if (expectedPart2 !== null) {
    console.log(`        should be: ${expectedPart2}`);
    assert(answers.part2.actual === expectedPart2);
  }
}
