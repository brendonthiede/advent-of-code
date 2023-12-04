fs = require('fs');

const inputType = 'sample';
const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => line.split(': ')[1]);

let total = 0;
const wins = [];

wins.push({
    "wins": 0,
    "copies": 0,
    "unprocessed": 0
});

input.forEach(line => {
    const winners = ' ' + line.split(' | ')[0] + ' '
    let winnings = 0;
    let winCount = 0;
    line.split(' | ')[1].trim().replace(/  /g, ' ').split(' ').forEach(number => {
        if (winners.indexOf(` ${number} `) !== -1) {
            winCount++;
            if (winnings > 0) {
                winnings *= 2;
            } else {
                winnings = 1;
            }
        }
    });
    total += winnings;
    wins.push({
        "wins": winCount,
        "copies": 1,
        "unprocessed": 1
    });
});

const part1 = total;

let needsProcessing = true;
while (needsProcessing) {
    needsProcessing = false;
    for (let i = wins.length - 1; i > 0; i--) {
        const unprocessed = wins[i].unprocessed;
        if (unprocessed === 0) {
            continue;
        }
        needsProcessing = true;
        const winCount = wins[i].wins;
        for (let j = i + 1; j <= i + winCount; j++) {
            wins[j].copies += unprocessed;
            wins[j].unprocessed += unprocessed;
        }
        wins[i].unprocessed = 0;
    }
}

if (inputType === 'sample') {
    wins.forEach((win, index) => {
        if (index === 0) {
            return;
        }
        console.log(`Game ${index}: ${JSON.stringify(win)}`);
    });
}

const part2 = wins.reduce((acc, win) => acc + win.copies, 0);

if (inputType === 'sample') {
    console.log(`Answer for part 1: ${part1} (should be 13)`);
    console.log(`Answer for part 2: ${part2} (should be 30)`);
} else {
    console.log(`Answer for part 1: ${part1}`);
    console.log(`Answer for part 2: ${part2}`);
}
