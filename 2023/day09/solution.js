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
  .split(/\r?\n/)
  .map(line => line.split(' ').map(Number));

function drillDown(histories) {
  input.forEach((line) => {
    const history = [];
    history.push(line);
    while (history[history.length - 1].some(num => num !== 0)) {
      const last = history[history.length - 1];
      const next = [];
      for (let j = 1; j < last.length; j++) {
        next.push(last[j] - last[j - 1]);
      }
      history.push(next);
    }
    histories.push(history);
  });
}

function addUp(histories) {
  histories.forEach((history) => {
    history[history.length - 1].push(0);
    for (let i = history.length - 1; i > 0; i--) {
      const currentTail = history[i][history[i].length - 1];
      const previousTail = history[i - 1][history[i - 1].length - 1];
      history[i - 1].push(currentTail + previousTail);
    }
  
  });
}

function minusUp(histories) {
  histories.forEach((history) => {
    history[history.length - 1].unshift(0);
    for (let i = history.length - 1; i > 0; i--) {
      const currentHead = history[i][0];
      const previousHead = history[i - 1][0];
      history[i - 1].unshift(previousHead - currentHead);
    }
  });
}

const histories = [];
drillDown(histories);
addUp(histories);
minusUp(histories);

const part1 = histories.map(history => history[0][history[0].length - 1]).reduce((a, b) => a + b, 0);
const part2 = histories.map(history => history[0][0]).reduce((a, b) => a + b, 0);

if (/sample.*/.test(inputType)) {
  console.log(`Answer for part 1: ${part1} (should be 114)`);
  console.log(`Answer for part 2: ${part2} (should be 2)`);
} else {
  console.log(`Answer for part 1: ${part1} (should be 1581679977)`);
  console.log(`Answer for part 2: ${part2} (should be 889)`);
}