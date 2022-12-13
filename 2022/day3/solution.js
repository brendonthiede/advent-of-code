fs = require('fs');

const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/)

// Grab only the duplicated characters
const duplicates = inputs.map(val => {
    const secondHalf = val.slice(val.length / 2)
    for (let index = 0; index < val.length; index++) {

        const character = val[index];
        if (secondHalf.indexOf(val[index]) > -1) {
            return character
        }
    }
})

let priorities = duplicates.map(val => {
    const priority = val.charCodeAt(0)
    return priority > 96 ? priority - 96 : priority - 38
})

console.log("Answer for part 1: " + priorities.reduce((a, b) => a + b, 0))

const groups = []
for (let index = 0; index < inputs.length; index+=3) {
    const firstLine = inputs[index];
    const secondLine = inputs[index + 1];
    const thirdLine = inputs[index + 2];
    
    for (let charIndex = 0; charIndex < firstLine.length; charIndex++) {

        const character = firstLine[charIndex];
        if (secondLine.indexOf(character) > -1 && thirdLine.indexOf(character) > -1) {
            groups.push(character)
            break
        }
    }
}

priorities = groups.map(val => {
    const priority = val.charCodeAt(0)
    return priority > 96 ? priority - 96 : priority - 38
})


console.log("Answer for part 2: " + priorities.reduce((a, b) => a + b, 0))
