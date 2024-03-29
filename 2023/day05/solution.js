const { exit } = require('process');

fs = require('fs');

// check for optional command line argument
let inputType = 'input';
if (process.argv.length > 2) {
  inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (inputType === 'sample' || process.argv.length > 3) {
  DEBUG = true;
}

const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n\r?\n/);

const maxInt = inputType === 'sample' ? 99 : 9999999999; // manual inspection of my input shows that the most digits in any number is 10, 2 for the sample
const seeds = input[0].replace(/seeds: /, '').split(/ /).map(seed => parseInt(seed));
const maps = {};

input.forEach((line, index) => {
  if (index === 0) {
    return;
  }
  const mapRows = line.split(/\r?\n/);
  const [sourceType, destinationType] = mapRows[0].replace(/ map:/, '').split('-to-');
  const shortMappings = [];
  mapRows.shift();
  mapRows.forEach((row) => {
    const mapping = row.split(' ');
    const destinationRangeStart = parseInt(mapping[0]);
    const sourceRangeStart = parseInt(mapping[1]);
    const rangeLength = parseInt(mapping[2]);
    const sourceRangeEnd = sourceRangeStart + rangeLength - 1;
    const destinationOffset = destinationRangeStart - sourceRangeStart;
    const destinationRangeEnd = destinationRangeStart + rangeLength - 1;
    shortMappings.push({
      sourceRangeStart,
      sourceRangeEnd,
      destinationRangeStart,
      destinationRangeEnd,
      destinationOffset
    });
  });
  shortMappings.sort((a, b) => {
    return a.sourceRangeStart - b.sourceRangeStart;
  })

  const mappings = [];
  if (shortMappings[0].sourceRangeStart > 0) {
    mappings.push(
      {
        sourceRangeStart: 0,
        sourceRangeEnd: shortMappings[0].sourceRangeStart - 1,
        destinationRangeStart: 0,
        destinationRangeEnd: shortMappings[0].sourceRangeStart - 1,
        destinationOffset: 0
      }
    );
  }
  mappings.push(shortMappings[0]);
  for (let i = 1; i < shortMappings.length; i++) {
    if (shortMappings[i - 1].sourceRangeEnd + 1 !== shortMappings[i].sourceRangeStart) {
      mappings.push(
        {
          sourceRangeStart: shortMappings[i - 1].sourceRangeEnd + 1,
          sourceRangeEnd: shortMappings[i].sourceRangeStart - 1,
          destinationRangeStart: shortMappings[i - 1].sourceRangeEnd + 1,
          destinationRangeEnd: shortMappings[i].sourceRangeStart - 1,
          destinationOffset: 0
        }
      );
    }
    mappings.push(shortMappings[i]);
  }
  mappings.push(
    {
      sourceRangeStart: shortMappings[shortMappings.length - 1].sourceRangeEnd + 1,
      sourceRangeEnd: maxInt,
      destinationRangeStart: shortMappings[shortMappings.length - 1].sourceRangeEnd + 1,
      destinationRangeEnd: maxInt,
      destinationOffset: 0
    }
  );

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
  };
}

function getLocation(seed, maps) {
  let currentMap = 'seed';
  let currentValue = seed;
  while (currentMap !== 'location') {
    const conversion = getConversion(currentValue, maps[currentMap]);
    currentValue = conversion.value;
    currentMap = conversion.type;
  }
  return currentValue;
}

const locationsPart1 = [];
seeds.forEach((seed) => {
  locationsPart1.push(getLocation(seed, maps));
});

if (inputType === 'sample') {
  console.log(`LocationsPart1: ${JSON.stringify(locationsPart1, null, 2)}`);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the numbers in input.txt are way too big to brute force
// you can collapse things into distinct ranges, since we know the pattern for ranges

// first, collapse the seeds to locations mappings, going through all the intermediate mappings
const finalSeedMapping = {
  destinationType: maps['seed'].destinationType,
  mappings: maps['seed'].mappings.slice(0)
}

// keep going until we get to the location map (the last one)
while (finalSeedMapping.destinationType !== 'location') {
  // the next mapping to consider is the one with the source type of the current destination type
  const nextMapping = {
    destinationType: maps[finalSeedMapping.destinationType].destinationType,
    mappings: maps[finalSeedMapping.destinationType].mappings.slice(0)
  }

  // sorting seed mapping by destination range start to line up with the next mapping source range start
  finalSeedMapping.mappings.sort((a, b) => {
    return a.destinationRangeStart - b.destinationRangeStart;
  });
  nextMapping.mappings.sort((a, b) => {
    return a.sourceRangeStart - b.sourceRangeStart;
  });

  if (DEBUG) {
    const tableData = [];
    for (let i = 0; i < Math.max(finalSeedMapping.mappings.length, nextMapping.mappings.length); i++) {
      tableData.push({
        'Seed Source Range': finalSeedMapping.mappings[i] !== undefined ? `${finalSeedMapping.mappings[i].sourceRangeStart} - ${finalSeedMapping.mappings[i].sourceRangeEnd}` : null,
        'Seed Dest Range': finalSeedMapping.mappings[i] !== undefined ? `${finalSeedMapping.mappings[i].destinationRangeStart} - ${finalSeedMapping.mappings[i].destinationRangeEnd}` : null,
        'Next Source Range': nextMapping.mappings[i] !== undefined ? `${nextMapping.mappings[i].sourceRangeStart} - ${nextMapping.mappings[i].sourceRangeEnd}` : null,
        'Next Dest Range': nextMapping.mappings[i] !== undefined ? `${nextMapping.mappings[i].destinationRangeStart} - ${nextMapping.mappings[i].destinationRangeEnd}` : null
      });
    }
    console.table(tableData);
  }

  // for each seed mapping entry, evaluate it against the next mapping entries until we find a match or make a change
  for (let seedMappingIndex = 0; seedMappingIndex < finalSeedMapping.mappings.length; seedMappingIndex++) {
    const seedMapping = finalSeedMapping.mappings[seedMappingIndex];
    for (let sourceIndex = 0; sourceIndex < nextMapping.mappings.length; sourceIndex++) {
      const sourceMapping = nextMapping.mappings[sourceIndex];

      // we only care about the mappings where the next mapping source range start matches the seed mapping destination range start
      if (seedMapping.destinationRangeStart === sourceMapping.sourceRangeStart) {
        // already handled, i.e. the seed mapping destination range is identical to the next mapping source range
        if (seedMapping.destinationRangeEnd === sourceMapping.sourceRangeEnd) {
          break;
        }

        // split the source range
        if (seedMapping.destinationRangeEnd < sourceMapping.sourceRangeEnd) {
          if (DEBUG) {
            console.log(`split the ${finalSeedMapping.destinationType} mapping source range ${sourceMapping.sourceRangeStart} - ${sourceMapping.sourceRangeEnd} at ${seedMapping.destinationRangeEnd}`);
          }
          const offset = sourceMapping.destinationOffset;

          const lhsSourceEnd = seedMapping.destinationRangeEnd;
          const lhsDestinationEnd = lhsSourceEnd + offset;

          const rhsSourceStart = lhsSourceEnd + 1;
          const rhsSourceEnd = sourceMapping.sourceRangeEnd;
          const rhsDestinationStart = lhsDestinationEnd + 1;
          const rhsDestinationEnd = sourceMapping.destinationRangeEnd;

          // update the current entry to end at the beginning of the next mapping range
          sourceMapping.sourceRangeEnd = lhsSourceEnd;
          sourceMapping.destinationRangeEnd = lhsDestinationEnd;

          // push new entry for the rest of the next mapping range
          nextMapping.mappings.splice(sourceIndex + 1, 0, {
            sourceRangeStart: rhsSourceStart,
            sourceRangeEnd: rhsSourceEnd,
            destinationRangeStart: rhsDestinationStart,
            destinationRangeEnd: rhsDestinationEnd,
            destinationOffset: offset
          });
        }

        // split the destination range
        if (seedMapping.destinationRangeEnd > sourceMapping.sourceRangeEnd) {
          if (DEBUG) {
            console.log(`split the seed mapping destination range ${seedMapping.destinationRangeStart} - ${seedMapping.destinationRangeEnd} at ${sourceMapping.sourceRangeEnd}`);
          }

          const offset = seedMapping.destinationOffset;

          const lhsDestinationEnd = sourceMapping.sourceRangeEnd;
          const lhsSourceEnd = lhsDestinationEnd - offset;

          const rhsDestinationStart = lhsDestinationEnd + 1;
          const rhsDestinationEnd = seedMapping.destinationRangeEnd;
          const rhsSourceStart = lhsSourceEnd + 1;
          const rhsSourceEnd = seedMapping.sourceRangeEnd;

          // update the current entry to the beginning of the next mapping range
          seedMapping.sourceRangeEnd = lhsSourceEnd;
          seedMapping.destinationRangeEnd = lhsDestinationEnd;

          // push new entry to the end of the next mapping range
          finalSeedMapping.mappings.splice(seedMappingIndex + 1, 0, {
            sourceRangeStart: rhsSourceStart,
            sourceRangeEnd: rhsSourceEnd,
            destinationRangeStart: rhsDestinationStart,
            destinationRangeEnd: rhsDestinationEnd,
            destinationOffset: offset
          });
        }
      }
    }
  }


  // collapse the mappings
  for (let i = 0; i < finalSeedMapping.mappings.length; i++) {
    finalSeedMapping.mappings[i].destinationRangeStart = nextMapping.mappings[i].destinationRangeStart;
    finalSeedMapping.mappings[i].destinationRangeEnd = nextMapping.mappings[i].destinationRangeEnd;
    finalSeedMapping.mappings[i].destinationOffset = finalSeedMapping.mappings[i].destinationRangeStart - finalSeedMapping.mappings[i].sourceRangeStart;
  }

  // move on to the next map
  finalSeedMapping.destinationType = nextMapping.destinationType;
}


finalSeedMapping.mappings.sort((a, b) => {
  return a.destinationRangeStart - b.destinationRangeStart;
});

if (DEBUG) {
  console.log(`\n\nFinal, Full Seed Mapping to Location:\n`);
  console.table(finalSeedMapping.mappings);
}

// now convert the seeds to ranges
const seedRanges = [];
for (let i = 0; i < seeds.length; i += 2) {
  seedRanges.push({
    start: seeds[i],
    end: seeds[i] + seeds[i + 1] - 1
  });
}

// same approach as above, but for the seed ranges
let rangeModified = true;
while (rangeModified) {
  rangeModified = false;
  seedRanges.sort((a, b) => {
    return a.start - b.start;
  });
  finalSeedMapping.mappings.sort((a, b) => {
    return a.sourceRangeStart - b.sourceRangeStart;
  });

  if (DEBUG) {
    const tableData = [];
    for (let i = 0; i < Math.max(finalSeedMapping.mappings.length, seedRanges.length); i++) {
      tableData.push({
        'Seed Range': seedRanges[i] !== undefined ? `${seedRanges[i].start} - ${seedRanges[i].end}` : null,
        'Seed Source Range': finalSeedMapping.mappings[i] !== undefined ? `${finalSeedMapping.mappings[i].sourceRangeStart} - ${finalSeedMapping.mappings[i].sourceRangeEnd}` : null,
        'Location Dest Range': finalSeedMapping.mappings[i] !== undefined ? `${finalSeedMapping.mappings[i].destinationRangeStart} - ${finalSeedMapping.mappings[i].destinationRangeEnd}` : null
      });
    }
    console.table(tableData);
  }

  // loop through the seed ranges
  for (let seedRange = 0; seedRange < seedRanges.length; seedRange++) {
    for (let mappingIndex = 0; mappingIndex < finalSeedMapping.mappings.length; mappingIndex++) {
      const sourceMapping = finalSeedMapping.mappings[mappingIndex];

      if (seedRanges[seedRange].start >= sourceMapping.sourceRangeStart) {
        if (seedRanges[seedRange].start > sourceMapping.sourceRangeEnd) {
          // this was a non-comprehensive range
          continue;
        }

        // already handled
        if (seedRanges[seedRange].end === sourceMapping.sourceRangeEnd) {
          break;
        }

        // changes will be coming
        rangeModified = true;

        // split the source range
        if (seedRanges[seedRange].end < sourceMapping.sourceRangeEnd) {
          if (DEBUG) {
            console.log(`split the mapping source range ${sourceMapping.sourceRangeStart} - ${sourceMapping.sourceRangeEnd} at ${seedRanges[seedRange].end}`);
          }
          const offset = sourceMapping.destinationOffset;

          const lhsSourceEnd = seedRanges[seedRange].end;
          const lhsDestinationEnd = lhsSourceEnd + offset;

          const rhsSourceStart = lhsSourceEnd + 1;
          const rhsSourceEnd = sourceMapping.sourceRangeEnd;
          const rhsDestinationStart = lhsDestinationEnd + 1;
          const rhsDestinationEnd = sourceMapping.destinationRangeEnd;

          // update the current entry to end at the beginning of the next mapping range
          sourceMapping.sourceRangeEnd = lhsSourceEnd;
          sourceMapping.destinationRangeEnd = lhsDestinationEnd;

          // push new entry for the rest of the next mapping range
          finalSeedMapping.mappings.push({
            sourceRangeStart: rhsSourceStart,
            sourceRangeEnd: rhsSourceEnd,
            destinationRangeStart: rhsDestinationStart,
            destinationRangeEnd: rhsDestinationEnd,
            destinationOffset: offset
          });
          break;
        }

        // split the destination range
        if (seedRanges[seedRange].end > sourceMapping.sourceRangeEnd) {
          if (DEBUG) {
            console.log(`split the seed mapping destination range ${seedRanges[seedRange].start} - ${seedRanges[seedRange].end} at ${sourceMapping.sourceRangeEnd}`);
          }
          const lhsEnd = sourceMapping.sourceRangeEnd;

          const rhsStart = lhsEnd + 1;
          const rhsEnd = seedRanges[seedRange].end;

          // update the current entry to the beginning of the next mapping range
          seedRanges[seedRange].end = lhsEnd;

          // push new entry to the end of the next mapping range
          seedRanges.push({
            start: rhsStart,
            end: rhsEnd
          });
          break;
        }

        console.log(`ERROR: should not get here`);
      }
    }

    if (rangeModified) {
      break;
    }
  }
}

seedRanges.sort((a, b) => {
  return a.start - b.start;
});
finalSeedMapping.mappings.sort((a, b) => {
  return a.sourceRangeStart - b.sourceRangeStart;
});

const truncatedSeedMappings = {
  destinationType: finalSeedMapping.destinationType,
  mappings: []
};

for (let i = 0; i < seedRanges.length; i++) {
  for (let j = 0; j < finalSeedMapping.mappings.length; j++) {
    if (seedRanges[i].start >= finalSeedMapping.mappings[j].sourceRangeStart && seedRanges[i].end <= finalSeedMapping.mappings[j].sourceRangeEnd) {
      truncatedSeedMappings.mappings.push(finalSeedMapping.mappings[j]);
      break;
    }
  }
}

if (DEBUG) {
  console.log(`\n\nFinal, Truncated Seed Ranges and Seed Mapping to Location:`);
  const tableData = [];
  for (let i = 0; i < Math.max(truncatedSeedMappings.mappings.length, seedRanges.length); i++) {
    tableData.push({
      'Seed Range': seedRanges[i] !== undefined ? `${seedRanges[i].start} - ${seedRanges[i].end}` : null,
      'Seed Source Range': truncatedSeedMappings.mappings[i] !== undefined ? `${truncatedSeedMappings.mappings[i].sourceRangeStart} - ${truncatedSeedMappings.mappings[i].sourceRangeEnd}` : null,
      'Location Dest Range': truncatedSeedMappings.mappings[i] !== undefined ? `${truncatedSeedMappings.mappings[i].destinationRangeStart} - ${truncatedSeedMappings.mappings[i].destinationRangeEnd}` : null
    });
  }
  console.table(tableData);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const part1 = Math.min(...locationsPart1);
// lowest location for a range will be for the minimum start of a destination/location range
const part2 = Math.min(...truncatedSeedMappings.mappings.map(mapping => mapping.destinationRangeStart));

if (inputType === 'sample') {
  console.log(`Answer for part 1: ${part1} (should be 35)`);
  console.log(`Answer for part 2: ${part2} (should be 46)`);
} else {
  console.log(`Answer for part 1: ${part1} (should be 51752125)`);
  console.log(`Answer for part 2: ${part2} (should be 12634632)`);
}
