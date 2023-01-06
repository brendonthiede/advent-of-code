fs = require('fs');

const shapeMapping = {
    "A": 1,
    "B": 2,
    "C": 3,
    "X": 1,
    "Y": 2,
    "Z": 3,
}

const wldScore = function (theirShapeScore, yourShapeScore) {
    if (theirShapeScore == yourShapeScore) return 3
    if ((yourShapeScore == 1 ? 4 : yourShapeScore) == theirShapeScore + 1) return 6
    return 0
}

let inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map(val => {
    const pieces = val.split(' ')
    const theirCode = pieces[0]
    const yourCode = pieces[1]
    const theirShapeScore = shapeMapping[theirCode]
    const yourShapeScore = shapeMapping[yourCode]
    const yourWldScore = wldScore(theirShapeScore, yourShapeScore)

    return yourShapeScore + yourWldScore
});

console.log("Answer for part 1: " + inputs.reduce((a, b) => a + b, 0))

const actionMapping = {
    "X": 0,
    "Y": 3,
    "Z": 6
}

inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map(val => {
    const pieces = val.split(' ')
    const theirCode = pieces[0]
    const yourCode = pieces[1]
    const theirShapeScore = shapeMapping[theirCode]
    const yourWldScore = actionMapping[yourCode]
    let yourShapeScore = theirShapeScore
    if (yourWldScore == 0) {
        yourShapeScore = theirShapeScore == 1 ? 3 : theirShapeScore - 1
    }
    if (yourWldScore == 6) {
        yourShapeScore = theirShapeScore == 3 ? 1 : theirShapeScore + 1
    }
    const yourTotal = yourShapeScore + yourWldScore

    return yourShapeScore + yourWldScore
});

console.log("Answer for part 2: " + inputs.reduce((a, b) => a + b, 0))
