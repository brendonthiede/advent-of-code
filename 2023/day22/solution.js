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
	.split(/\r?\n/)
	.map(row => row.split('~'));
let bricks = [];

class Brick {
  constructor(start, end) {
    this.start = start.map(Number);
    this.end = end.map(Number);
    this.supporters = new Set();
    this.supporting = new Set();
  }

  getAllPositions() {
    const positions = [];
    for (let x = Math.min(this.start[0], this.end[0]); x <= Math.max(this.start[0], this.end[0]); x++) {
      for (let y = Math.min(this.start[1], this.end[1]); y <= Math.max(this.start[1], this.end[1]); y++) {
        for (let z = Math.min(this.start[2], this.end[2]); z <= Math.max(this.start[2], this.end[2]); z++) {
          positions.push([x, y, z]);
        }
      }
    }
    return positions;
  }

  moveDown() {
    this.start[2]--;
    this.end[2]--;
  }
}

// Parse input and create bricks
bricks = input
  .filter(row => row.length === 2) // Ensure we only process valid rows
  .map(row => {
    if (DEBUG) {
      console.log('Processing row:', row);
    }
    const [startCoord, endCoord] = row;
    if (!startCoord || !endCoord) {
      console.error('Invalid row:', row);
      return null;
    }
    const start = startCoord.split(',');
    const end = endCoord.split(',');
    return new Brick(start, end);
  })
  .filter(brick => brick !== null); // Remove any null entries

if (DEBUG) {
  console.log('Processed bricks:', bricks.length);
}

// Sort bricks by lowest z coordinate
bricks.sort((a, b) => Math.min(a.start[2], a.end[2]) - Math.min(b.start[2], b.end[2]));

// Simulate falling
function simulateFall() {
  const occupied = new Map();
  
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    let canFall = true;
    
    while (canFall) {
      if (Math.min(brick.start[2], brick.end[2]) === 1) {
        canFall = false;
        continue;
      }

      // Check if brick can fall further
      const nextPositions = brick.getAllPositions().map(([x, y, z]) => [x, y, z - 1]);
      for (const pos of nextPositions) {
        const key = pos.join(',');
        if (occupied.has(key) && occupied.get(key) !== brick) {
          canFall = false;
          const supporter = occupied.get(key);
          brick.supporters.add(supporter);
          supporter.supporting.add(brick);
        }
      }

      if (canFall) brick.moveDown();
    }

    // Mark positions as occupied
    for (const pos of brick.getAllPositions()) {
      occupied.set(pos.join(','), brick);
    }
  }
}

simulateFall();

// Part 1: Count safely removable bricks
const possibilities = bricks.filter(brick => {
  return Array.from(brick.supporting).every(supported => 
    supported.supporters.size > 1
  );
});

const part1 = possibilities.length;

// Part 2: Calculate chain reactions
function countFalling(startBrick) {
  const falling = new Set([startBrick]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const brick of bricks) {
      if (falling.has(brick)) continue;
      if (brick.supporters.size > 0 && 
          Array.from(brick.supporters).every(supporter => falling.has(supporter))) {
        falling.add(brick);
        changed = true;
      }
    }
  }

  return falling.size - 1; // Subtract 1 to exclude the starting brick
}

const part2 = bricks.reduce((sum, brick) => sum + countFalling(brick), 0);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 5,
      input: 386
    }
  },
  part2: {
    actual: null,
    expected: {
      sample: 7,
      input: 39933
    }
  }
};

// Now we can update part2
answers.part2.actual = part2;

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
