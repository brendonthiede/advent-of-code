const path = require('path');

fs = require('fs');
let valvesLeftToOpen = ''

function getInputs(type) {
    const inputs = fs.readFileSync(`${__dirname}/${type}.txt`, 'utf8')
        .split(/\r?\n/)
        .map(row => {
            const matches = row.match(/Valve (\w+) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.*)/)
            const details = {
                name: matches[1],
                flowRate: parseInt(matches[2]),
                tunnels: matches[3].split(', ')
            }
            if (details.flowRate > 0) valvesLeftToOpen += `|${details.name}|`
            return details
        })
    return new Map(inputs.map(v => [v.name, v]))
}

function findValve(name) {
    return inputs.get(name)
}

function bestFlowChoice(position, remainingTime, valvesLeftToOpen, totalFlowRate, visitedSinceLastValve = '') {
    if (remainingTime <= 0 || valvesLeftToOpen.length < 4) {
        return { totalFlowRate: totalFlowRate }
    }
    const choices = []
    // when you do not open this one
    for (const tunnel of position.tunnels) {
        // avoid turning right back around if you didn't open this one (wasteful travel)
        if (visitedSinceLastValve.indexOf(`|${tunnel}|`) === -1) {
            choices.push(bestFlowChoice(findValve(tunnel), remainingTime - 1, valvesLeftToOpen, totalFlowRate, visitedSinceLastValve + `|${position.name}|`))
        }
    }
    // when you do open this one
    if (valvesLeftToOpen.indexOf(position.name) >= 0 && remainingTime > 0) {
        remainingTime--
        if (remainingTime > 0) {
            valvesLeftToOpen = valvesLeftToOpen.replace(`|${position.name}|`, '')
            for (const tunnel of position.tunnels) {
                choices.push(bestFlowChoice(findValve(tunnel), remainingTime - 1, valvesLeftToOpen, totalFlowRate + position.flowRate * remainingTime, `|${position.name}|`))
            }
        }
    }

    const bestChoice = choices.reduce((best, choice) => {
        if (choice.totalFlowRate > best.totalFlowRate) {
            return { totalFlowRate: choice.totalFlowRate }
        }
        return best
    }, { totalFlowRate: totalFlowRate })
    return bestChoice
}

const inputs = getInputs('input')
const iterations = 30
const startTimer = new Date()
const bestForPart1 = bestFlowChoice(findValve('AA'), iterations, valvesLeftToOpen, 0)
const duration = new Date() - startTimer
console.log(`Ran for ${duration}ms == ${duration / 1000}s == ${duration / 1000 / 60}m`)
console.log(`Answer for part 1: ${bestForPart1.totalFlowRate}`)
