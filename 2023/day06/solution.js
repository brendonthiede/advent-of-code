fs = require('fs');

const inputType = 'input';
const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
    .split(/\r?\n/);

const times = input[0].replace(/Time:\s*/, '').replace(/\s+/g, ' ').split(' ').map(Number);
const distances = input[1].replace(/Distance:\s*/, '').replace(/\s+/g, ' ').split(' ').map(Number);

function distanceForChargeTime(chargeTime, totalTime) {
    return chargeTime * (totalTime - chargeTime);
}

const raceResults = [];

for (let i = 0; i < times.length; i++) {
    const totalTime = times[i];
    const distanceToBeat = distances[i];

    raceResults.push({
        totalTime,
        distanceToBeat
    });

    // the maximum distance for charge times 1..totalTime will always be in the middle
    
    console.log(`${times[i]}: ${distanceForChargeTime(times[i], 2503)}`);
    // use binary search to find the lowest time that works
    let isLowEndFound = false;
    let highEnd = Math.floor(totalTime / 2);
    let lowEnd = Math.floor(highEnd / 2);
    while (!isLowEndFound) {
        if (distanceForChargeTime(lowEnd, totalTime) > distanceToBeat) {
            highEnd = lowEnd;
            lowEnd = Math.floor(lowEnd / 2);
        } else if (distanceForChargeTime(lowEnd + 1, totalTime) > distanceToBeat) {
            lowEnd = lowEnd + 1;
            raceResults[i].lowEnd = lowEnd;
            isLowEndFound = true;
        } else {
            lowEnd = Math.floor((highEnd + lowEnd) / 2);
        }
    }

    let isHighEndFound = false;
    lowEnd = Math.floor(totalTime / 2);
    highEnd = Math.floor(totalTime * .75);
    while (!isHighEndFound) {
        if (distanceForChargeTime(highEnd, totalTime) > distanceToBeat) {
            lowEnd = highEnd;
            highEnd = Math.floor((totalTime + lowEnd) / 2);
        } else if (distanceForChargeTime(highEnd - 1, totalTime) > distanceToBeat) {
            highEnd = highEnd - 1;
            raceResults[i].highEnd = highEnd;
            isHighEndFound = true;
        } else {
            highEnd = Math.floor((highEnd + lowEnd) / 2);
        }
    }

    raceResults[i].winCount = raceResults[i].highEnd - raceResults[i].lowEnd + 1;
}

console.log(JSON.stringify(raceResults, null, 2));

const part1 = raceResults.reduce((acc, result) => {
    return acc * result.winCount;
}, 1);

const part2 = 0;

if (inputType === 'sample') {
    console.log(`Answer for part 1: ${part1} (should be 288)`);
} else {
    console.log(`Answer for part 1: ${part1}`);
}
