function decToSnafu(dec) {
    const snafu = []
    while (dec > 0) {
        snafu.push(dec % 5)
        dec = Math.floor(dec / 5)
    }

    let carry = 0
    return snafu.reduce((final, val, index) => {
        val += carry
        if (val > 2) {
            carry = 1
        } else {
            carry = 0
        }
        final = `${val === 3 ? '=' : val === 4 ? '-' : val === 5 ? '0' : `${val}`}${final}`
        if (index === snafu.length - 1 && carry > 0) {
            final = `${carry}${final}`
        }
        return final
    }, '')
}

function snafuToDec(snafu) {
    let dec = 0
    let carry = 0
    snafu.split('').reverse().forEach((val, index) => {
        const digit = val === '=' ? -2 : val === '-' ? -1 : parseInt(val)
        dec += digit * Math.pow(5, index)
        carry = digit === 3 || digit === 4 ? 1 : 0
    })
    return dec
}

const fs = require('fs')
console.log(`Answer for part 1: ${decToSnafu(fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => snafuToDec(line))
    .reduce((sum, val) => sum + val, 0))}`)
