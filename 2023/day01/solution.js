fs = require('fs');
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/);

const part1 = inputs.map(line => line.replace(/\D/g, ''))
    .map(line => line.slice(0, 1) + line.slice(-1))
    .map(line => parseInt(line))
    .reduce((a, b) => a + b, 0);
    
    
    function partTwoConversion(line) {
        const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        // can't just replace the word, because it may be part of another word, but duplicating the word for now will work
        numberWords.forEach((word, index) => {
            const regex = new RegExp(word, 'gi');
            line = line.replace(regex, word + index + word);
        })
        
        return line;
    }
    
    
    const part2 = inputs
    .map(line => partTwoConversion(line))
    .map(line => line.replace(/\D/g, ''))
    .map(line => line.slice(0, 1) + line.slice(-1))
    .map(line => parseInt(line))
    .reduce((a, b) => a + b, 0);

console.log("Answer for part 1: " + part1);
console.log("Answer for part 2: " + part2);

// < 55445