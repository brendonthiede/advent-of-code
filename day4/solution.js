fs = require('fs');

const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/)

Number.prototype.isInRange = function (range) {
    return this >= range[0] && this <= range[1]
}

console.log("Answer for part 1: " + inputs.reduce((cumulative, line) => {
    const elves = line.split(',')
    elfOneTaskRange = elves[0].split('-').map(Number)
    elfTwoTaskRange = elves[1].split('-').map(Number)

    if ((elfOneTaskRange[0].isInRange(elfTwoTaskRange)
        && elfOneTaskRange[1].isInRange(elfTwoTaskRange))
        || (elfTwoTaskRange[0].isInRange(elfOneTaskRange)
            && elfTwoTaskRange[1].isInRange(elfOneTaskRange))) {
        return cumulative + 1
    } else {
        return cumulative
    }
}, 0))

console.log("Answer for part 2: " + inputs.reduce((cumulative, line) => {
    const elves = line.split(',')
    elfOneTaskRange = elves[0].split('-').map(Number)
    elfTwoTaskRange = elves[1].split('-').map(Number)
    elfOneTaskRange[0]
    if (elfOneTaskRange[0].isInRange(elfTwoTaskRange)
        || elfOneTaskRange[1].isInRange(elfTwoTaskRange)
        || elfTwoTaskRange[0].isInRange(elfOneTaskRange)
        || elfTwoTaskRange[1].isInRange(elfOneTaskRange)) {
        return cumulative + 1
    } else {
        return cumulative
    }
}, 0))