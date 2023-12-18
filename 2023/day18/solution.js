const { assert } = require('console');

const fs = require('fs');

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
  .map(raw => {
    let [direction, distance, color] = raw.split(' ');
    distance = parseInt(distance);
    color = color.replace(/[)(#]/g, '');
    return { direction, distance, color };
  });

function digEdge(input) {
  let position = [0, 0];
  let minY = 0;
  let maxY = 0;
  let minX = 0;
  let maxX = 0;
  const edges = [];

  edges.push(position.join(','));
  input.forEach(({ direction, distance }) => {
    let dx = 0;
    let dy = 0;
    switch (direction) {
      case 'R':
        dx = 1;
        break;
      case 'L':
        dx = -1;
        break;
      case 'U':
        dy = -1;
        break;
      case 'D':
        dy = 1;
        break;
    }
    for (let i = 0; i < distance; i++) {
      position[0] += dx;
      position[1] += dy;
      minX = Math.min(minX, position[0]);
      maxX = Math.max(maxX, position[0]);
      minY = Math.min(minY, position[1]);
      maxY = Math.max(maxY, position[1]);
      edges.push(position.join(','));
    }
  });

  return {
    edges,
    minX,
    maxX,
    minY,
    maxY
  };
}

function fill(edges, minX, maxX, minY, maxY) {
  const map = [];
  for (let i = minY; i <= maxY; i++) {
    let row = [];
    for (let j = minX; j <= maxX; j++) {
      if (edges.includes([j, i].join(','))) {
        row.push('#');
      } else {
        row.push('?');
      }
    }
    map.push(row);
  }

  let hasChanged = true;
  while (hasChanged) {
    hasChanged = false;
    for (let i = 0; i < map.length; i++) {
      let row = map[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === '?') {
          let left = j > 0 ? map[i][j - 1] : '.';
          let right = j < map[i].length - 1 ? map[i][j + 1] : '.';
          let up = i > 0 ? map[i - 1][j] : '.';
          let down = i < map.length - 1 ? map[i + 1][j] : '.';
          if (left === '.' || right === '.' || up === '.' || down === '.') {
            map[i][j] = '.';
            hasChanged = true;
          }
        }
      }
    }
  }

  return map.map(row => row.map(elem => elem === '?' ? '#' : elem));
}

const { edges, minX, maxX, minY, maxY } = digEdge(input);

if (DEBUG) {
  console.log('Edges:')
  for (let i = minY; i <= maxY; i++) {
    let row = '';
    for (let j = minX; j <= maxX; j++) {
      if (edges.includes([j, i].join(','))) {
        row += '#';
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
  console.log('\n');
}

const map = fill(edges, minX, maxX, minY, maxY);
if (DEBUG) {
  console.log('Filled in:')
  console.log(map.map(row => row.join('')).join('\n'));
  console.log('\n');
}

const part1 = map.reduce((sum, row) => sum + row.filter(elem => elem === '#').length, 0);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 62,
      input: 41019
    }
  },
  part2: {
    actual: null,
    expected: {
      sample: null,
      input: null
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
