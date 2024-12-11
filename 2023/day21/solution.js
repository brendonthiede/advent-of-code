const { readFileSync } = require('fs');
const { assert } = require('console');

// check for optional command line argument
let defaultInputType = 'sample';
let inputType = defaultInputType;
if (process.argv.length > 2) {
  inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (/sample.*/.test(inputType) || process.argv.length > 3) {
  DEBUG = true;
}

const input = readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n/);

function inputToMatrix(input) {
  const rows = input.length;
  const cols = input[0].length;
  let elfPos;
  const matrix = Array.from({length: rows}, () => Array(cols));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let value = input[row][col];
      if (value == 'S') {
        elfPos ={row, col};
        value = '.';
      }
      matrix[row][col] = {row, col, value};
    }
  }
  return {rows, cols, matrix, elfPos};
}

// part 1
function modulo(op1, op2) {
  return ((op1 % op2) + op2) % op2; // Euclidean modulo
}

function getNeighbors(row, col) {
  return [
    {row: row - 1, col: col}, // N
    {row: row, col: col + 1}, // E
    {row: row + 1, col: col}, // S
    {row: row, col: col - 1}, // W
  ];
}

// Breadth First Search BFS
function bfs(row, col, matrix, maxSteps = 64) {
  const cameFrom = new Map();
  const queue = [];
  queue.push({row, col, step: 0});
  cameFrom.set(`${row}:${col}`, {row, col, step: 0});

  while (queue.length > 0) {
    const cell = queue.shift();
    if (cell.step >= maxSteps) continue;
    const neighbors = getNeighbors(cell.row, cell.col);
    for (const n of neighbors) {
      const key = `${n.row}:${n.col}`;
      if (cameFrom.has(key)) continue;
      // part 2: the map is a flat torus
      if (matrix[modulo(n.row, rows)][modulo(n.col, cols)].value == '#') continue;
      queue.push({...n, step: cell.step + 1});
      cameFrom.set(key, {...cell, step: cell.step + 1});
    }
  }
  cameFrom.delete(`${row}:${col}`);
  return cameFrom;
}

function getCount(cameFrom, isNbStepsOdd = false) {
  const distCond = (distance) => isNbStepsOdd ? distance % 2 == 1 : distance % 2 == 0;
  let count = isNbStepsOdd ? 0 : 1;
  for (const {step} of cameFrom.values()) {
    if (distCond(step)) count++;
  }
  return count;
}

const {rows, cols, matrix, elfPos} = inputToMatrix(input);
let maxSteps = 64;
if (/sample.*/.test(inputType)) {
  maxSteps = 6;
}
const cameFrom = bfs(elfPos.row, elfPos.col, matrix, maxSteps);

const part1 = getCount(cameFrom);

// part 2
/**
 * Lagrange's Interpolation formula for
 * ax ^ 2 + bx + c with x = [0,1,2] and y = [y0,y1,y2] we have
 * f(x) = (x^2 - 3x + 2) * y0 / 2 - (x^2 - 2x) * y1 + (x^2 - x) * y2 / 2
 *
 * so the coefficients are:
 * a = y0 / 2 - y1 + y2 / 2
 * b = -3 * y0 / 2 + 2 * y1 - y2 / 2
 * c = y0
 */
function  lagrangeInterpolation(y0, y1, y2) {
  return {
    a: y0 / 2 - y1 + y2 / 2,
    b: -3 * (y0 / 2) + 2 * y1 - y2 / 2,
    c: y0,
  };
};


// middle line of my "diamond": 65 dots + S + 65 dots
const countMap = getCount(bfs(elfPos.row, elfPos.col, matrix, 65), true);
const countMapAround = getCount(bfs(elfPos.row, elfPos.col, matrix, 65 + 131), false);
const countMapAroundAround = getCount(bfs(elfPos.row, elfPos.col, matrix, 65 + (131 * 2)), true);
const {a, b, c} = lagrangeInterpolation(countMap, countMapAround, countMapAroundAround);
const target = (26501365 - 65) / 131;

const part2 = (a * target ** 2 + b * target + c);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 16,
      input: 3503
    }
  },
  part2: {
    actual: part2,
    expected: {
      sample: 489407465079112,
      input: 584211423220706
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
