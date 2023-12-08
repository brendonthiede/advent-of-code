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
  .split(/\r?\n/);

const directions = input[0].split('');
const network = input.slice(2).map(line => {
  const [node, left, right] = line.split(/[ =),(]+/)
  return { node, left, right };
});

function aaaToZZZ(directions, network) {
  let currentNode = 'AAA';
  let nextDirection = 0;
  let steps = 0;
  while (currentNode !== 'ZZZ') {
    const { left, right } = network.find(({ node }) => node === currentNode);
    currentNode = directions[nextDirection] === 'L' ? left : right;
    nextDirection = (nextDirection + 1) % directions.length;
    steps++;
  }
  return steps;
}

// manual inspection showed that my inputs all had exactly 1 cycle that would come back to itself in the same number of steps as originally taken to get to it
// this allowed for some cleanup, but some input will definitely break this
function aToZCycleLengths(directions, network) {
  const currentNodes = network.filter(node => /.*A$/.test(node.node)).map(node => node.node);
  const cycleLengths = currentNodes.map(node => {
    let nextDirection = 0;
    let steps = 0;
    let currentNode = node;
    while (true) {
      let { left, right } = network.find(({ node }) => node === currentNode);
      currentNode = directions[nextDirection] === 'L' ? left : right;
      nextDirection = (nextDirection + 1) % directions.length;
      steps++;
      if (/.*Z$/.test(currentNode)) {
        break;
      }
    }
    return steps;
  });

  return cycleLengths;
}

function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lowestCommonMultiple(cycleLengths) {
  // find the lowest common multiple of the cycles
  const lowestCommonMultiple = cycleLengths.reduce((a, b) => {
    return lcm(a, b);
  });
  return lowestCommonMultiple;
}

let part1 = 0;
let part2 = 0;

if (inputType === 'sample' || inputType === 'input') {
  part1 = aaaToZZZ(directions, network);
}

if (inputType === 'sample2' || inputType === 'input') {
  part2 = lowestCommonMultiple(aToZCycleLengths(directions, network));
}

if (inputType === 'sample') {
  console.log(`Answer for part 1: ${part1} (should be 6)`);
  console.log('Answer for part 2 cannot be calculated from sample');
} else if (inputType === 'sample2') {
  console.log('Answer for part 1 cannot be calculated from sample2');
  console.log(`Answer for part 2: ${part2} (should be 6)`);
} else {
  console.log(`Answer for part 1: ${part1} (should be 21251)`);
  console.log(`Answer for part 2: ${part2} (should be 11678319315857)`);
}
