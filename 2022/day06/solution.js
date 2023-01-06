fs = require('fs')

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')

function findUniqueSequence(sequenceLength) {
    for (let sequenceStart = 0; sequenceStart < input.length; sequenceStart++) {
        const sequence = input.substring(sequenceStart, sequenceStart + sequenceLength)
        let sequenceIsGood = true
        for (let index = 0; index < sequence.length - 1; index++) {
            const element = sequence[index];
            if (sequence.split(element).length > 2) {
                sequenceIsGood = false
                break
            }
        }
        if (sequenceIsGood) {
            return sequenceStart + sequenceLength
        }
    }
}

console.log("Answer for part 1: " + findUniqueSequence(4))
console.log("Answer for part 2: " + findUniqueSequence(14))