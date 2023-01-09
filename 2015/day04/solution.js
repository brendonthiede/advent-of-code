const fs = require('fs')
const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')

const crypto = require('crypto')

function findZeroes(secretKey, length) {
    const prefix = '0'.repeat(length)
    let lowestDecimal = 0
    while (true) {
        if (crypto.createHash('md5').update(`${secretKey}${lowestDecimal}`).digest('hex').startsWith(prefix)) return lowestDecimal
        lowestDecimal++
    }
}

console.log(`Answer to part 1: ${findZeroes(input, 5)}`)
console.log(`Answer to part 2: ${findZeroes(input, 6)}`)
