fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map(Number)

let pair2020 = []
for (let i = 0; i < inputs.length; i++) {
    const lhs = inputs[i]
    const rhs = 2020 - lhs
    if (inputs.includes(rhs)) {
        pair2020 = [lhs, rhs]
        break
    }
}

console.log("Answer for part 1: " + pair2020[0] * pair2020[1])

let trio2020 = []
for (let i = 0; i < inputs.length; i++) {
    const lhs = inputs[i]
    for (let j = i + 1; j < inputs.length; j++) {
        const mid = inputs[j]
        const rhs = 2020 - lhs - mid
        if (inputs.includes(rhs)) {
            trio2020 = [lhs, mid, rhs]
            break
        }
    }
    if (trio2020.length > 0) {
        break
    }
}

console.log("Answer for part 1: " + trio2020[0] * trio2020[1] * trio2020[2])