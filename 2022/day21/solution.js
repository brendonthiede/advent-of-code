
const fs = require('fs')
const inputType = 'input'
const monkeys = new Map(fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8').split(/\r?\n/).map(line => line.split(': ')))

const operationPattern = /(\w+) ([+-/*]) (\w+)/
while (isNaN(monkeys.get('root'))) {
    for (const [key, value] of monkeys) {
        if (isNaN(value)) {
            const match = value.match(operationPattern)
            if (match) {
                let lhs = match[1]
                const operator = match[2]
                let rhs = match[3]
                if (isNaN(lhs)) {
                    const lhsValue = monkeys.get(lhs)
                    if (!isNaN(lhsValue)) lhs = lhsValue
                }
                if (isNaN(rhs)) {
                    const rhsValue = monkeys.get(rhs)
                    if (!isNaN(rhsValue)) rhs = rhsValue
                }
                if (!isNaN(lhs) && !isNaN(rhs)) {
                    monkeys.set(key, eval(`${lhs} ${operator} ${rhs}`))
                } else {
                    monkeys.set(key, `${lhs} ${operator} ${rhs}`)
                }
            }
        }
    }
}

console.log(`Answer for part 1: ${monkeys.get('root')}`)
