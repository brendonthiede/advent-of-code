function simplifyExpression(expression, monkeys) {
    const match = expression.match(/(\w+) ([+-/*]) (\w+)/)
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
            return eval(`${lhs} ${operator} ${rhs}`)
        } else {
            return `${lhs} ${operator} ${rhs}`
        }

    }
    return expression
}

function reduceVariables(expression, monkeys) {
    // go until there are no more variables other than humn
    while (expression.replace('humn', '').match(/[a-z]+/g)) {
        // search for any variable and look up its value
        const match = expression.match(/([a-z]+)/g)
        if (match) {
            for (const m of match) {
                let val = monkeys.get(m)
                if (isNaN(val)) {
                    val = `(${val})`
                }
                expression = expression.replace(m, val)
            }
        }
    }
    return expression
}

function resultForHumn(expression, humn) {
    return eval(expression.replace('humn', humn))
}

function bigResultForHumn(expression, humn) {
    // replace humn with the value
    expression = expression.replace('humn', humn)

    // reduce parentheses working from the inside out
    let match = expression.match(/\(([^()]+)\)/)
    while (match) {
        const before = expression.slice(0, match.index)
        let middle = match[1].replace(/[\(\)]/g, '')
        const after = expression.slice(match.index + match[0].length)
        const pieces = match[1].split(' ')
        if (pieces.length === 3) {
            const lhs = new Big(pieces[0])
            const operator = pieces[1]
            const rhs = new Big(pieces[2])
            let result = new Big('0')
            switch (operator) {
                case '+':
                    result = lhs.plus(rhs)
                    break
                case '-':
                    result = lhs.minus(rhs)
                    break
                case '*':
                    result = lhs.times(rhs)
                    break
                case '/':
                    result = lhs.div(rhs)
                    break
            }
            middle = result.toString()
        }
        expression = `${before}${middle}${after}`
        match = expression.match(/\(([^()]+)\)/)
    }

    return new Big(expression)
}

function needsToKeepGoing(expected, expression, humn, directionOfIncrease) {
    return directionOfIncrease * resultForHumn(expression, humn) < directionOfIncrease * expected
}

// original solution for part 2 using trial and error
function digitFinder(expression, expected) {
    let ceiling = 1
    let humn = `${ceiling}`
    let digits = ''

    // is this an increasing linear function?
    const directionOfIncrease = resultForHumn(expression, 0) < resultForHumn(expression, 1) ? 1 : -1

    // magnitude of humn
    while (needsToKeepGoing(expected, expression, humn, directionOfIncrease)) {
        ceiling *= 10
        humn = `${digits}${ceiling}`
    }

    const resultMagnitude = Math.log10(ceiling)
    for (let position = resultMagnitude - 1; position >= 0; position--) {
        const trailingZeroes = '0'.repeat(position)
        for (let tens = 0; tens < 10; tens++) {
            if (directionOfIncrease * resultForHumn(expression, `${digits}${tens + 1}${trailingZeroes}`) > directionOfIncrease * expected) {
                digits += `${tens}`
                break
            }
        }
    }

    return parseInt(digits)
}

// new solution for part 2 solving for the line equation
function getHumnValueFromEquation(expression, expected) {
    // determine slope and intercept
    const intercept = bigResultForHumn(expression, 0)
    const slope = bigResultForHumn(expression, 1).minus(intercept)

    // y = mx + b => x = (y - b) / m
    return new Big(`${expected}`).minus(intercept).div(slope).toFixed(0).toString()
}

function doMonkeyMath(monkeys) {
    while (isNaN(monkeys.get('root'))) {
        for (const [key, value] of monkeys) {
            if (isNaN(value)) {
                monkeys.set(key, simplifyExpression(value, monkeys))
            }
        }
    }
    return monkeys.get('root')
}

function getHumnEquation(monkeys) {
    monkeys.set('humn', 'humn')
    const rootVals = monkeys.get('root').split(' ')
    monkeys.set('root', 'root')

    // try reducing things
    for (let i = 0; i < monkeys.size; i++) {
        for (const [key, value] of monkeys) {
            if (isNaN(value)) {
                monkeys.set(key, simplifyExpression(value, monkeys))
            }
        }
    }

    // now leave only humn
    let lhs = reduceVariables(rootVals[0], monkeys)
    let rhs = reduceVariables(rootVals[2], monkeys)

    return `${lhs} = ${rhs}`
}

function getHumnValue(monkeys) {
    const equation = getHumnEquation(monkeys)
    const lhs = equation.split(' = ')[0]
    const rhs = equation.split(' = ')[1]

    const fromMath = getHumnValueFromEquation(lhs, parseInt(rhs))
    const fromFinder = `${digitFinder(lhs, parseInt(rhs))}`

    if (fromMath !== fromFinder) {
        throw new Error(`Mathematical and trial and error results don't match: ${fromMath} vs ${fromFinder}`)
    }

    return fromMath
}

const Big = require('big.js')
Big.strict = true
Big.DP = 100
Big.NE = 100
Big.PE = 100
const fs = require('fs')
const inputType = 'input'
const monkeys = new Map(fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8').split(/\r?\n/).map(line => line.split(': ')))

console.log(`Answer for part 1: ${doMonkeyMath(new Map([...monkeys.entries()]))}`)
console.log(`Answer for part 2: ${getHumnValue(new Map([...monkeys.entries()]))}`)
