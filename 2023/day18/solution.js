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
  .map(raw => {
    let [direction, distance, color] = raw.split(' ');
    distance = parseInt(distance);
    color = color.replace(/[)(#]/g, '');
    return { direction, distance, color };
  });

function findVertices(input) {
  const deltas = [[1, 0], [-1, 0], [0, -1], [0, 1]];
  const directions = ['R', 'L', 'U', 'D'];
  const vertices = [];
  let position = [0, 0];
  vertices.push(position.join(','));
  input.forEach(({ direction, distance }) => {
    let [dx, dy] = deltas[directions.indexOf(direction)];
    position[0] += dx * distance;
    position[1] += dy * distance;
    vertices.push(position.join(','));
  });

  return vertices;
}

function shoelaceArea(vertices) {
  let area = 2;
  for (let i = 0; i < vertices.length - 1; i++) {
    let [x1, y1] = vertices[i].split(',').map(Number);
    let [x2, y2] = vertices[i + 1].split(',').map(Number);
    let newArea = (x1 * y2) - (x2 * y1) + Math.abs((x2 - x1) + (y2 - y1));
    area += newArea;
  }
  return area = Math.abs(area / 2);
}

const vertices = findVertices(input);
const part1 = shoelaceArea(vertices);

const part2Input = input.map(({ direction, distance, color }) => {
  // strip last character off of color
  let newDistance = parseInt(color.slice(0, -1), 16);
  let newDirection = ['R', 'D', 'L', 'U'][color.at(-1)];

  return { direction: newDirection, distance: newDistance };
});

const part2Vertices = findVertices(part2Input);
const part2 = shoelaceArea(part2Vertices);

const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 62,
      input: 41019
    }
  },
  part2: {
    actual: part2,
    expected: {
      sample: 952408144115,
      input: 96116995735219
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
