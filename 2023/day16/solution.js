const { assert } = require('console');
const { get } = require('http');

fs = require('fs');

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

const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n/)
  .map(line => line.split(''));

function getBeamLocations(input, start) {
  const beamLocations = [];
  const unprocessedLocations = [];
  unprocessedLocations.push(start);
  beamLocations.push(start);

  while (unprocessedLocations.length > 0) {
    const location = unprocessedLocations.shift();
    const [x, y, moving] = location.split(',');
    const [xInt, yInt] = [parseInt(x), parseInt(y)];
    const lensSymbol = input[yInt][xInt];

    const nextLocations = [];
    if (moving === 'right') {
      if ((lensSymbol === '.' || lensSymbol === '-') && xInt < input[yInt].length - 1) {
        nextLocations.push(`${xInt + 1},${yInt},right`);
      } else if (lensSymbol === '|') {
        if (yInt > 0) {
          nextLocations.push(`${xInt},${yInt - 1},up`);
        }
        if (yInt < input.length - 1) {
          nextLocations.push(`${xInt},${yInt + 1},down`);
        }
      } else if (lensSymbol === '\\' && yInt < input.length - 1) {
        nextLocations.push(`${xInt},${yInt + 1},down`);
      } else if (lensSymbol === '/' && yInt > 0) {
        nextLocations.push(`${xInt},${yInt - 1},up`);
      }
    } else if (moving === 'down') {
      if ((lensSymbol === '.' || lensSymbol === '|') && yInt < input.length - 1) {
        nextLocations.push(`${xInt},${yInt + 1},down`);
      } else if (lensSymbol === '-') {
        if (xInt > 0) {
          nextLocations.push(`${xInt - 1},${yInt},left`);
        }
        if (xInt < input[yInt].length - 1) {
          nextLocations.push(`${xInt + 1},${yInt},right`);
        }
      } else if (lensSymbol === '\\' && xInt < input[yInt].length - 1) {
        nextLocations.push(`${xInt + 1},${yInt},right`);
      } else if (lensSymbol === '/' && xInt > 0) {
        nextLocations.push(`${xInt - 1},${yInt},left`);
      }
    } else if (moving === 'left') {
      if ((lensSymbol === '.' || lensSymbol === '-') && xInt > 0) {
        nextLocations.push(`${xInt - 1},${yInt},left`);
      } else if (lensSymbol === '|') {
        if (yInt > 0) {
          nextLocations.push(`${xInt},${yInt - 1},up`);
        }
        if (yInt < input.length - 1) {
          nextLocations.push(`${xInt},${yInt + 1},down`);
        }
      } else if (lensSymbol === '\\' && yInt > 0) {
        nextLocations.push(`${xInt},${yInt - 1},up`);
      } else if (lensSymbol === '/' && yInt < input.length - 1) {
        nextLocations.push(`${xInt},${yInt + 1},down`);
      }
    } else if (moving === 'up') {
      if ((lensSymbol === '.' || lensSymbol === '|') && yInt > 0) {
        nextLocations.push(`${xInt},${yInt - 1},up`);
      } else if (lensSymbol === '-') {
        if (xInt > 0) {
          nextLocations.push(`${xInt - 1},${yInt},left`);
        }
        if (xInt < input[yInt].length - 1) {
          nextLocations.push(`${xInt + 1},${yInt},right`);
        }
      } else if (lensSymbol === '\\' && xInt > 0) {
        nextLocations.push(`${xInt - 1},${yInt},left`);
      } else if (lensSymbol === '/' && xInt < input[yInt].length - 1) {
        nextLocations.push(`${xInt + 1},${yInt},right`);
      }
    }

    nextLocations.forEach(nextLocation => {
      if (!beamLocations.includes(nextLocation)) {
        beamLocations.push(nextLocation);
        unprocessedLocations.push(nextLocation);
      }
    });
  }

  return beamLocations;
}

function getUniqueBeamLocations(beamLocations) {
  const uniqueBeamLocations = [];
  beamLocations.forEach(beamLocation => {
    const [x, y] = beamLocation.split(',');
    const location = `${x},${y}`;
    if (!uniqueBeamLocations.includes(location)) {
      uniqueBeamLocations.push(location);
    }
  });
  return uniqueBeamLocations;
}

function countBeamLocations(input, start) {
  const beamLocations = getBeamLocations(input, start);
  const uniqueBeamLocations = getUniqueBeamLocations(beamLocations);
  return uniqueBeamLocations.length;
}

function maximumEdgePath(input) {
  const edgePaths = [];
  for (let y = 0; y < input.length; y++) {
    edgePaths.push(countBeamLocations(input, `0,${y},right`));
    edgePaths.push(countBeamLocations(input, `${input[y].length - 1},${y},left`));
  }
  for (let x = 0; x < input[0].length; x++) {
    edgePaths.push(countBeamLocations(input, `${x},0,down`));
    edgePaths.push(countBeamLocations(input, `${x},${input.length - 1},up`));
  }
  return Math.max(...edgePaths);
}

const part1 = countBeamLocations(input, '0,0,right');
const part2 = maximumEdgePath(input);

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
