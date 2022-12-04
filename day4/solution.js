fs = require('fs');

const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/)

console.log("Answer for part 1: " + inputs.reduce((a, b) => {
    const elves = b.split(',')
    elfOneParts = elves[0].split('-').map(Number)
    elfTwoParts = elves[1].split('-').map(Number)

    if ((elfOneParts[0] <= elfTwoParts[0] && elfOneParts[1] >= elfTwoParts[1])
        || (elfOneParts[0] >= elfTwoParts[0] && elfOneParts[1] <= elfTwoParts[1])) {
        return a + 1
    } else {
        return a
    }
}, 0))

// not 825
console.log("Answer for part 2: " + inputs.reduce((a, b) => {
    const elves = b.split(',')
    elfOneParts = elves[0].split('-').map(Number)
    elfTwoParts = elves[1].split('-').map(Number)

    if ((elfOneParts[0] >= elfTwoParts[0] && elfOneParts[0] <= elfTwoParts[1])
        || (elfOneParts[1] >= elfTwoParts[0] && elfOneParts[1] <= elfTwoParts[1])
        || (elfTwoParts[0] >= elfOneParts[0] && elfTwoParts[0] <= elfOneParts[1])
        || (elfTwoParts[1] >= elfOneParts[0] && elfTwoParts[1] <= elfOneParts[1])) {
        return a + 1
    } else {
        return a
    }
}, 0))