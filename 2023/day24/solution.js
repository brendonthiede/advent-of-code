const { readFileSync } = require('fs');
const { assert } = require('console');
const { init } = require('z3-solver');

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
  .map(line => line.split(/[ ]*[@,][ ]+/g).map(Number));

function printAnswers(part1, part2) {
  const answers = {
    part1: {
      actual: part1,
      expected: {
        sample: 2,
        input: 15262
      }
    },
    part2: {
      actual: part2,
      expected: {
        sample: 47,
        input: 695832176624149
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
}

let TEST_AREA_MINIMUM = 200000000000000;
let TEST_AREA_MAXIMUM = 400000000000000;
if (/sample.*/.test(inputType)) {
  TEST_AREA_MINIMUM = 7;
  TEST_AREA_MAXIMUM = 27;
}

// x1 + vx1 * t1 = x = x2 + vx2 * t2
// y1 + vy1 * t1 = y = y2 + vy2 * t2
// t2 = (x - x2) / vx2
// t1 = (x2 - x1 + vx2 * t2) / vx1 = (y2 - y1 + vy2 * t2) / vy1
// t1 = (y2 - y1 + (vy2 * (x1 - x2)) / vx2) / (vy1 - (vy2 * xv1) / xv2)

function timeOfIntersection(body1, body2) {
  // Handle parallel lines
  const denominator = body1.xVelocity * body2.yVelocity - body2.xVelocity * body1.yVelocity;
  if (Math.abs(denominator) < 1e-10) return null;
  
  const dx = body2.x - body1.x;
  const dy = body2.y - body1.y;
  
  const t1 = (dx * body2.yVelocity - dy * body2.xVelocity) / denominator;
  return t1;
}

function intersections(input) {
  let count = 0;
  
  input.forEach((hailstone, i) => {
    const body1 = {
      x: hailstone[0],
      y: hailstone[1],
      xVelocity: hailstone[3],
      yVelocity: hailstone[4],
    }
    
    input.forEach((hailstone2, j) => {
      if (i >= j) return;
      
      const body2 = {
        x: hailstone2[0],
        y: hailstone2[1],
        xVelocity: hailstone2[3],
        yVelocity: hailstone2[4],
      }

      const t1 = timeOfIntersection(body1, body2);
      if (t1 === null) return;
      
      // Calculate t2 using the x-coordinates
      const t2 = (body1.x + body1.xVelocity * t1 - body2.x) / body2.xVelocity;
      
      // Both times must be positive for future intersection
      if (t1 < 0 || t2 < 0) return;
      
      const x = body1.x + body1.xVelocity * t1;
      const y = body1.y + body1.yVelocity * t1;
      
      if (x >= TEST_AREA_MINIMUM && x <= TEST_AREA_MAXIMUM && 
          y >= TEST_AREA_MINIMUM && y <= TEST_AREA_MAXIMUM) {
        count++;
      }
    });
  });

  return count;
}

const part1 = intersections(input);

async function solveEquations(input) {
  const { Context, em } = await init();
  const { Solver, Real } = new Context('main');
  let solver = new Solver();
  
  try {
    const x = Real.const('x');
    const y = Real.const('y');
    const z = Real.const('z');
    const vx = Real.const('vx');
    const vy = Real.const('vy');
    const vz = Real.const('vz');

    // Only need first 3 hailstones for a unique solution
    for (let i = 0; i < 3; i++) {
      const [x1, y1, z1, vx1, vy1, vz1] = input[i];
      const t = Real.const(`t${i}`);
      
      solver.add(x.add(vx.mul(t)).eq(t.mul(vx1).add(x1)));
      solver.add(y.add(vy.mul(t)).eq(t.mul(vy1).add(y1)));
      solver.add(z.add(vz.mul(t)).eq(t.mul(vz1).add(z1)));
    }

    await solver.check();

    const model = solver.model();
    const xVal = parseFloat(model.get(x).toString());
    const yVal = parseFloat(model.get(y).toString());
    const zVal = parseFloat(model.get(z).toString());

    return {
      x: xVal,
      y: yVal,
      z: zVal
    };
  } finally {
    em.PThread.terminateAllThreads();
  }
}

async function hitAll(input, part1Answer) {
  const { x, y, z } = await solveEquations(input);
  const part2 = x + y + z;
  printAnswers(part1Answer, part2);
  process.exit(0); // Ensure clean exit after printing answers
}

hitAll(input, part1);
