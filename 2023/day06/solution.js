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

function getRaceResult(totalTime, distanceToBeat) {
    const raceResult = {
        totalTime,
        distanceToBeat
    };

    // the maximum distance for charge times 1..totalTime will always be in the middle
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
            raceResult.lowEnd = lowEnd;
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
            raceResult.highEnd = highEnd;
            isHighEndFound = true;
        } else {
            highEnd = Math.floor((highEnd + lowEnd) / 2);
        }
    }

    raceResult.winCount = raceResult.highEnd - raceResult.lowEnd + 1;

    return raceResult;
}

for (let i = 0; i < times.length; i++) {
    const totalTime = times[i];
    const distanceToBeat = distances[i];

    raceResults.push(getRaceResult(totalTime, distanceToBeat));
}

console.log(JSON.stringify(raceResults, null, 2));

const part1 = raceResults.reduce((acc, result) => {
    return acc * result.winCount;
}, 1);

const part2Time = parseInt(times.reduce((acc, time) => {
    return acc + time;
}, ''));

const part2Distance = parseInt(distances.reduce((acc, distance) => {
    return acc + distance;
}, ''));

const part2 = getRaceResult(part2Time, part2Distance).winCount;

if (inputType === 'sample') {
    console.log(`Answer for part 1: ${part1} (should be 288)`);
    console.log(`Answer for part 2: ${part2} (should be 71503)`);
} else {
    console.log(`Answer for part 1: ${part1} (should be 1084752)`);
    console.log(`Answer for part 2: ${part2} (should be 28228952)`);
}
