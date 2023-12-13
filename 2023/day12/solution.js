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

function parseInput(inputType, repeats) {
  const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => {
      let [springs, groups] = line.split(' ');
      springs = Array(repeats).fill(springs).join('?');
      groups = Array(repeats).fill(groups.split(',')).flat().map(Number);

      return { springs, groups };
    });

  return input;
}

function countArrangements(springs, groups, springPosition, groupIndex) {
  // check cache
  if (cache[springPosition] && cache[springPosition][groupIndex] !== undefined) {
    return cache[springPosition][groupIndex];
  }

  // at the end of springs; halting condition
  if (springPosition >= springs.length) {
    // only return 1 if there are no more groups
    return groupIndex === groups.length ? 1 : 0;
  }

  // at the end of groups; halting condition
  if (groupIndex === groups.length) {
    // if there are any remaining broken springs, this is not a valid arrangement, so return 0, otherwise return 1
    return springs.indexOf('#', springPosition) === -1 ? 1 : 0;
  }

  let result = 0;
  if (springs[springPosition] !== '#') {
    result += countArrangements(springs, groups, springPosition + 1, groupIndex);
  }

  // it's possibly a broken spring
  if (springs[springPosition] !== '.' &&
    // and it's possible to fit the group before the end of the springs
    groups[groupIndex] <= springs.length - springPosition &&
    // and there's no working spring before the end of the group
    !springs.substring(springPosition, springPosition + groups[groupIndex]).includes('.') &&
    // and there's room for a space after the group
    springs[springPosition + groups[groupIndex]] !== '#') {

    result += countArrangements(springs, groups, springPosition + groups[groupIndex] + 1, groupIndex + 1);
  }

  if (!cache[springPosition]) {
    cache[springPosition] = {};
  }
  cache[springPosition][groupIndex] = result;

  return result;
}

function processInput(input) {
  return input.map(({ springs, groups }) => {
    const beforeSprings = springs;
    const beforeGroups = groups.slice(0);

    const sortedGroups = groups.slice(0).sort((a, b) => b - a);
    for (let i = 0; i < sortedGroups.length; i++) {
      const largest = sortedGroups[i];
      const largestPattern = new RegExp(`[#]{${largest}}`);
      if (largestPattern.test(springs)) {
        springs = springs.replace(largestPattern, '*'.repeat(largest));
      } else {
        break;
      }
    }

    // leave a space between each known
    springs = springs.replace(/\?\*/g, '.*');
    springs = springs.replace(/\*\?/g, '*.');
    springs = springs.replace(/\*/g, '#');

    if (DEBUG && beforeSprings !== springs) {
      console.log("Before:");
      console.log(beforeSprings, beforeGroups);

      console.log("After:");
      console.log(springs, groups);
    }

    cache = {};
    return { springs, groups, arrangements: countArrangements(springs, groups, 0, 0) };
  })
    .reduce((acc, { arrangements }) => acc + arrangements, 0);
}

let cache = {};
const part1 = processInput(parseInput(inputType, 1));
const part2 = processInput(parseInput(inputType, 5));

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 21)`);
  assert(part1 === 21);
  console.log(`Answer for part 2: ${part2} (should be 525152)`);
  assert(part2 === 525152);
} else {
  console.log(`Answer for part 1: ${part1} (should be 6488)`);
  assert(part1 === 6488);
  console.log(`Answer for part 2: ${part2} (should be 815364548481)`);
  assert(part2 === 815364548481);
}
