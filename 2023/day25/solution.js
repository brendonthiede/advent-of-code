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

let cutEdges = ['hfx/pzl', 'bvb/cmg', 'jqt/nvd'];
if (!/sample.*/.test(inputType)) {
  // used graphviz via visualizer.sh to determine the connections to cut by looking at neato output. dot was too noisy with the defaults. circo would have been nice, but it took too long
  cutEdges = ['grd/hvm', 'jmn/zfk', 'kdc/pmn'];
}

const input = readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n/)
  .map(row => {
    let [name, connections] = row.split(': ');
    connections = connections.split(' ');
    return {
      name,
      connections
    };
  });

// nodes that are not part of any connections other than their own
const loners = new Set(input.map(row => row.name));
const edges = new Map();
input.forEach(row => {
  const { name, connections } = row;
  connections.forEach(connection => {
    loners.delete(connection);
    if (cutEdges.includes(`${name}/${connection}`) || cutEdges.includes(`${connection}/${name}`)) {
      return;
    }

    if (edges.has(name)) {
      edges.get(name).push(connection);
    } else {
      edges.set(name, [connection]);
    }

    if (edges.has(connection)) {
      edges.get(connection).push(name);
    } else {
      edges.set(connection, [name]);
    }
  });
});

function connectedNodeCount(startNode) {
  const queue = [startNode];
  const nodes = new Set();
  while (queue.length > 0) {
    const node = queue.pop();
    if (nodes.has(node)) {
      continue;
    }
    nodes.add(node);
    const neighbors = edges.get(node) || [];
    for (const neighbor of neighbors) {
      queue.push(neighbor);
    }

  }
  return nodes.size;
}

if (DEBUG) {
  console.log('loners', loners);
  const sortedEdges = Array.from(edges).sort(([a], [b]) => a.localeCompare(b));
  sortedEdges.forEach(([key, value]) => {
    value.forEach(node => {
      console.log(`${key} => ${node}`);
    });
  });
}

const part1 = connectedNodeCount(Array.from(loners)[0]) * connectedNodeCount(Array.from(loners)[1]);



const answers = {
  part1: {
    actual: part1,
    expected: {
      sample: 54,
      input: null
    }
  },
  part2: {
    actual: null,
    expected: {
      sample: null,
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
