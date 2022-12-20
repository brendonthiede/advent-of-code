function mixSequence(sequence, repetitions = 1, multiplier = 1) {
    const mixedCopy = sequence.slice()
    for (let rep = 0; rep < repetitions; rep++) {
        for (let i = 0; i < sequence.length; i++) {
            if (rep === 0 && multiplier > 1) {
                sequence[i].value *= multiplier
            }
            const item = sequence[i]
            const currentIndex = mixedCopy.indexOf(item)
            mixedCopy.splice(currentIndex, 1)
            const newIndex = (currentIndex + item.value) % mixedCopy.length
            if (newIndex === 0) {
                // back of the line with you
                mixedCopy.push(item)
            } else {
                mixedCopy.splice(newIndex, 0, item)
            }
        }
    }
    return mixedCopy
}

function getCoordinates(mixed) {
    const zeroPosition = mixed.findIndex((val) => val.value === 0)
    return (
        mixed[(zeroPosition + 1000) % mixed.length].value +
        mixed[(zeroPosition + 2000) % mixed.length].value +
        mixed[(zeroPosition + 3000) % mixed.length].value
    ).toString()
}

const fs = require('fs')
const sequence = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/).map((val, index) => { return { value: parseInt(val) } })

let mixed = mixSequence(sequence)
console.log(`Answer for part 1: ${getCoordinates(mixed)}`)
mixed = mixSequence(sequence, 10, 811589153)
console.log(`Answer for part 2: ${getCoordinates(mixed)}`)
