const { readFileSync } = require('fs');
const { Heap } = require('heap-js');

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
  .split(/\r?\n/)
  .map((line) => line.split('').map(Number));

const DIRECTIONS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

function findPath(map, minMomentum, maxMomentum) {
  const heap = new Heap((a, b) => a.heat - b.heat);

  heap.init([
    { i: 1, j: 0, heat: 0, dir: DIRECTIONS.down, momentum: 1 },
    { i: 0, j: 1, heat: 0, dir: DIRECTIONS.right, momentum: 1 },
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
    }

    const nextDirs = [];
    switch (momentum >= minMomentum && dir) {
      case DIRECTIONS.up:
      case DIRECTIONS.down:
        nextDirs.push(DIRECTIONS.left);
        nextDirs.push(DIRECTIONS.right);
        break;
      case DIRECTIONS.left:
      case DIRECTIONS.right:
        nextDirs.push(DIRECTIONS.up);
        nextDirs.push(DIRECTIONS.down);
    }
    if (momentum < maxMomentum) {
      nextDirs.push(dir);
    }
    nextDirs.forEach((nextDir) => {
      heap.push({
        i: i + nextDir[0],
        j: j + nextDir[1],
        heat: heat + map[i][j],
        dir: nextDir,
        momentum: 1 + +(dir === nextDir) * momentum,
      });
    });
  }
}

console.log('Answer for part 1:', findPath(input, 0, 3));
console.log('Answer for part 2:', findPath(input, 4, 10));
