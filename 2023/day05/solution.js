fs = require('fs');

const inputType = 'input';
const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
    .split(/\r?\n\r?\n/);

const seeds = input[0].replace(/seeds: /, '').split(/ /).map(seed => parseInt(seed));
const maps = {};

input.forEach((line, index) => {
    if (index === 0) {
        return;
    }
    const mapRows = line.split(/\r?\n/);
    const [sourceType, destinationType] = mapRows[0].replace(/ map:/, '').split('-to-');
    const mappings = [];
    mapRows.shift();
    mapRows.forEach((row) => {
        const mapping = row.split(' ');
        const destinationRangeStart = parseInt(mapping[0]);
        const sourceRangeStart = parseInt(mapping[1]);
        const rangeLength = parseInt(mapping[2]);
        const destinationRangeEnd = destinationRangeStart + rangeLength - 1;
        const sourceRangeEnd = sourceRangeStart + rangeLength - 1;
        mappings.push({
            sourceRangeStart,
            sourceRangeEnd,
            destinationOffset: destinationRangeStart - sourceRangeStart
        });
    });
    maps[sourceType] = {
        destinationType,
        mappings
    };
});

if (inputType === 'sample') {
    console.log(`Maps: ${JSON.stringify(maps, null, 2)}`);
}

function getConversion(value, map) {
    let newValue = value;
    const mapping = map.mappings.find(mapping => {
        return value >= mapping.sourceRangeStart && value <= mapping.sourceRangeEnd;
    });
    if (mapping) {
        newValue = value + mapping.destinationOffset;
    }

    return {
        type: map.destinationType,
        value: newValue
    }
}

function getLocation(seed, maps) {
    let currentMap = 'seed'
    let currentValue = seed;
    while (currentMap !== 'location') {
        const conversion = getConversion(currentValue, maps[currentMap]);
        currentValue = conversion.value;
        currentMap = conversion.type;
    }
    return currentValue;
}

const locations = [];
seeds.forEach((seed) => {
    locations.push(getLocation(seed, maps));
});

if (inputType === 'sample') {
    console.log(`Locations: ${JSON.stringify(locations, null, 2)}`);
}

const part1 = Math.min(...locations);

if (inputType === 'sample') {
    console.log(`Answer for part 1: ${part1} (should be 35)`);
} else {
    console.log(`Answer for part 1: ${part1}`);
}
