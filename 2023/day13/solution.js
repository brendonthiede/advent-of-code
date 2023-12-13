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
  .split(/\r?\n\r?\n/).map(rawMap => { return { rawMap } });

function lineDifference(line1, line2) {
  let differences = 0;
  for (let i = 0; i < line1.length; i++) {
    if (line1.substr(i, 1) !== line2.substr(i, 1)) {
      differences++;
      if (differences > 1) {
        return differences; // short circuit, since we only care if there are 0 or 1
      }
    }
  }
  return differences;
}

function lineOfReflection(mirrorMap, maxDifferences) {
  let lineOfReflection = -1;
  const directions = ['horizontal', 'vertical'];
  directions.forEach(direction => {
    let map = mirrorMap.rawMap.split(/\r?\n/);
    let multiplier = 100;
    if (direction === 'vertical') {
      multiplier = 1;
      const tmp = [];
      for (let i = 0; i < map[0].length; i++) {
        let column = '';
        for (let j = 0; j < map.length; j++) {
          column += map[j].substr(i, 1);
        }
        tmp.push(column);
      }
      map = tmp;
    }
    for (let i = 0; i < map.length - 1; i++) {
      // look for the center of a potential vertical reflection
      let differences = lineDifference(map[i], map[i + 1]);
      if (differences <= maxDifferences) {
        let isReflection = true;
        // verify that the reflection is valid
        const closestEdge = Math.min(i, map.length - i - 2);
        for (let j = 1; j <= closestEdge; j++) {
          differences += lineDifference(map[i - j], map[i + j + 1]);
          if (differences > maxDifferences) {
            isReflection = false;
            break;
          }
        }
        if (isReflection && differences === maxDifferences) {
          lineOfReflection = (i + 1) * multiplier;
          return;
        }
      }
    }
  });
  return lineOfReflection;
}

let part1 = 0;
input.forEach(mirrorMap => {
  part1 += lineOfReflection(mirrorMap, 0);
});

let part2 = 0;
input.forEach(mirrorMap => {
  part2 += lineOfReflection(mirrorMap, 1);
});

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 405)`);
  assert(part1 === 405);
  console.log(`Answer for part 2: ${part2} (should be 400)`);
  assert(part2 === 400);
} else {
  console.log(`Answer for part 1: ${part1} (should be 43614)`);
  assert(part1 === 43614);
  console.log(`Answer for part 2: ${part2} (should be 36771)`);
  assert(part2 === 36771);
}