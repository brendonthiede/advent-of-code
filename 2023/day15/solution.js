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
  .split(',');

function hash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash + value.charCodeAt(i)) * 17) % 256;
  }
  return hash;
}

function testHash() {
  assert(hash('rn=1') === 30);
  assert(hash('cm-') === 253);
  assert(hash('qp=3') === 97);
  assert(hash('cm=2') === 47);
  assert(hash('qp-') === 14);
  assert(hash('pc=4') === 180);
  assert(hash('ot=9') === 9);
  assert(hash('ab=5') === 197);
  assert(hash('pc-') === 48);
  assert(hash('pc=6') === 214);
  assert(hash('ot=7') === 231);
}

function readHashMapInstructions(input) {
  const hashMapInstructions = input.map(line => {
    const operation = /-/.test(line) ? 'delete' : 'upsert';
    const [label, focalLength] = line.split(/[=-]/);
    const box = hash(label);
    return { box, operation, label, focalLength };
  });
  return hashMapInstructions;
}

function runHashMapInstructions(hashMapInstructions, boxes) {
  for (let i = 0; i < hashMapInstructions.length; i++) {
    const { box, operation, label, focalLength } = hashMapInstructions[i];
    if (operation === 'upsert') {
      if (boxes[box].filter(lens => lens.label === label).length > 0) {
        boxes[box].map(lens => { 
          if (lens.label === label) {
            lens.focalLength = focalLength;
          }
          return lens;
         });
      } else {
        boxes[box].push({ box, label, focalLength });
      }
    } else {
      boxes[box] = boxes[box].filter(lens => lens.label !== label);
    }
    if (DEBUG) {
      console.log(`After "${label}${operation === 'upsert' ? '=' + focalLength : '-'}":`);
      boxes.forEach((lenses, index) => {
        if (lenses.length === 0) return;
        console.log(`Box ${index}: ${lenses.map(lens => `[${lens.label} ${lens.focalLength}]`).join(' ')}`);
      });
    }
  }
}

function getFocusingPower(lens, slot) {
  const { box, label, focalLength } = lens;
  return (box + 1) * slot * focalLength;
}

function getTotalFocusingPower(boxes) {
  let totalFocusingPower = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      totalFocusingPower += getFocusingPower(boxes[i][j], j + 1);
    }
  }
  return totalFocusingPower;
}

testHash();

console.log(`Input type ${inputType}`);

let part1 = 0;
input.forEach(line => {
  part1 += hash(line);
});

let part2input = input.slice(0);


const hashMapInstructions = readHashMapInstructions(part2input);
const boxes = Array.from({ length: 256 }, () => []);

runHashMapInstructions(hashMapInstructions, boxes);

let part2 = getTotalFocusingPower(boxes);


if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 1320)`);
  assert(part1 === 1320);
  console.log(`Answer for part 2: ${part2} (should be 145)`);
  assert(part2 === 145);
} else {
  console.log(`Answer for part 1: ${part1} (should be 522547)`);
  assert(part1 === 522547);
  console.log(`Answer for part 2: ${part2} (should be 229271)`);
  assert(part2 === 229271);
}