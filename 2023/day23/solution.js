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
  .map((row, rowNumber) => row.split('').map((cell, colNumber) => ({ row: rowNumber, col: colNumber, value: cell })));

const HEIGHT = input.length;
const WIDTH = input[0].length;
const START = input[0][1];
const FINISH = input[HEIGHT - 1][WIDTH - 2];
const POSSIBLE_NEIGHBORS = [
  { slope: '^', row: -1, col: 0 },
  { slope: '>', row: 0, col: 1 },
  { slope: 'v', row: 1, col: 0 },
  { slope: '<', row: 0, col: -1 }
];

function getNeighbors(row, col, input, isSlippery) {
  let neighbors = POSSIBLE_NEIGHBORS.map(neighbor => {
    return { slope: neighbor.slope, row: row + neighbor.row, col: col + neighbor.col }
  })
    .filter(neighbor => neighbor.row >= 0 && neighbor.row < HEIGHT && neighbor.col >= 0 && neighbor.col < WIDTH);

  if (isSlippery) {
    neighbors = neighbors.filter(neighbor => input[neighbor.row][neighbor.col].value === '.' || input[neighbor.row][neighbor.col].value === neighbor.slope);
  } else {
    neighbors = neighbors.filter(neighbor => input[neighbor.row][neighbor.col].value !== '#');
  }

  return neighbors.map(neighbor => input[neighbor.row][neighbor.col]);
}

function depthFirstSearch(cell, visited, input) {
  if (cell.row === HEIGHT - 1) {
    return 0;
  }
  let max = 0;
  visited.add(cell);
  const neighbors = getNeighbors(cell.row, cell.col, input, true);
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      max = Math.max(max, depthFirstSearch(neighbor, visited, input));
    }
  }
  visited.delete(cell);
  return max + 1;
}

function stepsToNextIntersection(first, second, input) {
  let steps = 1;
  let current = second;
  let previous = first;
  while (true) {
    const neighbors = getNeighbors(current.row, current.col, input, false)
      .filter(neighbor => neighbor.row !== previous.row || neighbor.col !== previous.col);

    // is this an intersection?
    if (neighbors.length !== 1) {
      break;
    }
    previous = current;
    current = neighbors[0];
    steps++;
  }
  return { steps, previous, intersection: current };
}

function getIntersections(first, second, input) {
  const queue = [{ first, second }];
  const visited = new Set();
  const intersections = new Map();
  while (queue.length > 0) {
    const { first, second } = queue.shift();
    const { steps, previous, intersection } = stepsToNextIntersection(first, second, input);
    const edge = `${`${first.col},${first.row}`}-${`${second.col},${second.row}`}`;
    if (!visited.has(edge)) {
      if (!intersections.has(`${intersection.col},${intersection.row}`)) {
        intersections.set(`${intersection.col},${intersection.row}`, []);
      }
      if (!intersections.has(`${first.col},${first.row}`)) {
        intersections.set(`${first.col},${first.row}`, []);
      }
      intersections.get(`${first.col},${first.row}`).push({ steps, dest: `${intersection.col},${intersection.row}` });
      intersections.get(`${intersection.col},${intersection.row}`).push({ steps, dest: `${first.col},${first.row}` });
      visited.add(edge);
    }

    getNeighbors(intersection.row, intersection.col, input, true)
      .filter(neighbor => neighbor !== previous)
      .forEach(second => queue.push({ first: intersection, second }));
  }
  return intersections;
}

function depthFirstSearchIntersections(nodeCoord, endCoord, visited, intersections) {
  if (nodeCoord === endCoord) {
    return 0;
  }
  let max = -Infinity;
  visited.add(nodeCoord);
  const neighborsData = intersections.get(nodeCoord);
  neighborsData.forEach(({ steps, dest }) => {
    if (visited.has(dest)) {
      return;
    }
    max = Math.max(max, depthFirstSearchIntersections(dest, endCoord, visited, intersections) + steps);
  });
  visited.delete(nodeCoord);
  return max;
}

const part1 = depthFirstSearch(START, new Set(), input);
const intersections = getIntersections(START, input[1][1], input);
const part2 = depthFirstSearchIntersections(`${START.col},${START.row}`, `${FINISH.col},${FINISH.row}`, new Set(), intersections);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 94,
      input: 2394
    }
  },
  part2: {
    actual: part2,
    expected: {
      sample: 154,
      input: 6554
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
