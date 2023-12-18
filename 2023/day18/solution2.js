const fs = require('fs');
const { assert } = require('console');
const { Heap } = require('heap-js');

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

const DIR = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

function solve(input, minMomentum, maxMomentum) {
  const map = input.split('\n').map((line) => line.split('').map(Number));

  const heap = new Heap((a, b) => a.heat - b.heat);

  heap.init([
    { i: 1, j: 0, heat: 0, dir: DIR.D, momentum: 1 },
    { i: 0, j: 1, heat: 0, dir: DIR.R, momentum: 1 },
  ]);
  const seen = map.map((row) => row.map(() => ({})));
  while (heap.length) {
    const { i, j, heat, dir, momentum } = heap.pop();
    const key = dir.concat(momentum).join();
    if (!map[i]?.[j] || seen[i][j][key]) {
      continue;
    }

    seen[i][j][key] = 1;

    if (
      i === map.length - 1 &&
      j === map[0].length - 1 &&
      momentum >= minMomentum
    ) {
      return heat + map[i][j];
      break;
    }

    const nextDirs = [];
    switch (momentum >= minMomentum && dir) {
      case DIR.U:
      case DIR.D:
        nextDirs.push(DIR.L);
        nextDirs.push(DIR.R);
        break;
      case DIR.L:
      case DIR.R:
        nextDirs.push(DIR.U);
        nextDirs.push(DIR.D);
    }
    if (momentum < maxMomentum) {
      nextDirs.push(dir);
    }
    for (const nextDir of nextDirs) {
      const [di, dj] = nextDir;
      heap.push({
        i: i + di,
        j: j + dj,
        heat: heat + map[i][j],
        dir: nextDir,
        momentum: 1 + (dir === nextDir ? momentum : 0),
      });
    }
  }
}

const part1 = solve(input, 0, 3);
const part2 = solve(input, 4, 10);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 102,
      input: 1076
    }
  },
  part2: {
    actual: part2,
    expected: {
      sample: 94,
      input: 1219
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
