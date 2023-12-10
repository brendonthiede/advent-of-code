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


const loop = [];

// find the starting location
for (let y = 0; y < input.length && loop.length === 0; y++) {
  for (let x = 0; x < input[y].length && loop.length === 0; x++) {
    if (input[y][x] === 'S') {
      loop.push([x, y]);
    }
  }
}

const directions = ['n', 's', 'e', 'w'];

// figure out what S is connected to
const startConnections = [];
for (let i = 0; i < directions.length; i++) {
  const direction = directions[i];
  const x = direction === 'e' ? 1 : direction === 'w' ? -1 : 0;
  const y = direction === 's' ? 1 : direction === 'n' ? -1 : 0;

  const current = [loop[0][0], loop[0][1]];
  const neighbor = [current[0] + x, current[1] + y];

  // make sure the neighbor is in bounds
  if (neighbor[0] < 0 || neighbor[0] >= input[0].length || neighbor[1] < 0 || neighbor[1] >= input.length) {
    continue;
  }

  const pipe = input[neighbor[1]][neighbor[0]];
  let isConnected = false;
  if (direction === 'n' && (pipe === '|' || pipe === '7' || pipe === 'F')) {
    isConnected = true;
  } else if (direction === 's' && (pipe === '|' || pipe === 'L' || pipe === 'J')) {
    isConnected = true;
  } else if (direction === 'e' && (pipe === '-' || pipe === 'J' || pipe === '7')) {
    isConnected = true;
  } else if (direction === 'w' && (pipe === '-' || pipe === 'L' || pipe === 'F')) {
    isConnected = true;
  }

  if (isConnected) {
    startConnections.push(direction);
  }
}

let startPipe = '';
let facing = '';
if (startConnections.indexOf('n') !== -1) {
  facing = 'n';
  if (startConnections.indexOf('s') !== -1) {
    startPipe = '|';
  } else if (startConnections.indexOf('e') !== -1) {
    startPipe = 'L';
  } else if (startConnections.indexOf('w') !== -1) {
    startPipe = 'J';
  }
} else if (startConnections.indexOf('s') !== -1) {
  facing = 's';
  if (startConnections.indexOf('w') !== -1) {
    startPipe = '7';
  } else if (startConnections.indexOf('e') !== -1) {
    startPipe = 'F';
  }
} else if (startConnections.indexOf('e') !== -1) {
  facing = 'e';
  if (startConnections.indexOf('w') !== -1) {
    startPipe = '-';
  }
}

function getNext(currentPos, currentPipe, facing) {
  let nextPos = [currentPos[0], currentPos[1]];
  let nextPipe = currentPipe;
  let nextFacing = facing;
  nextPos[0] += facing === 'e' ? 1 : facing === 'w' ? -1 : 0;
  nextPos[1] += facing === 's' ? 1 : facing === 'n' ? -1 : 0;
  nextPipe = input[nextPos[1]][nextPos[0]];

  if (facing === 'n') { // 7|F
    if (nextPipe === '7') {
      nextFacing = 'w';
    } else if (nextPipe === 'F') {
      nextFacing = 'e';
    }
  } else if (facing === 's') { // J|L
    if (nextPipe === 'J') {
      nextFacing = 'w';
    } else if (nextPipe === 'L') {
      nextFacing = 'e';
    }
  } else if (facing === 'e') { // J-7
    if (nextPipe === 'J') {
      nextFacing = 'n';
    } else if (nextPipe === '7') {
      nextFacing = 's';
    }
  } else if (facing === 'w') { // L-F
    if (nextPipe === 'L') {
      nextFacing = 'n';
    } else if (nextPipe === 'F') {
      nextFacing = 's';
    }
  }

  return {
    nextPos,
    nextPipe,
    nextFacing
  };
}

let currentPos = [loop[0][0], loop[0][1]];
let currentPipe = startPipe;

while (true) {
  if (DEBUG) {
    console.log(currentPos, currentPipe, facing);
  }
  const next = getNext(currentPos, currentPipe, facing);
    currentPos = next.nextPos;
    currentPipe = next.nextPipe;
    facing = next.nextFacing;
    loop.push(currentPos);
    if (currentPipe === 'S') {
      break;
    }
}


const part1 = (loop.length - 1) / 2;
const part2 = 0;

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 8)`);
  assert(part1 === 8);
} else {
  console.log(`Answer for part 1: ${part1} (should be 7097)`);
  assert(part1 === 7097);
}