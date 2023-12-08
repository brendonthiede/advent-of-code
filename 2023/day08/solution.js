fs = require('fs');

// check for optional command line argument
let defaultInputType = 'input';
let inputType = defaultInputType;
if (process.argv.length > 2) {
  inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (inputType === 'sample' || process.argv.length > 3) {
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
    const nextNode = directions[nextDirection] === 'L' ? left : right;
    currentNode = nextNode;
    nextDirection = (nextDirection + 1) % directions.length;
    steps++;
  }
  return steps;
}

part1 = aaaToZZZ(directions, network);

if (inputType === 'sample') {
  console.log(`Answer for part 1: ${part1} (should be 6)`);
} else {
  console.log(`Answer for part 1: ${part1} (should be 21251)`);
}
