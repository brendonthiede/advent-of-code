const path = require('path');

fs = require('fs');
const valvesLeftToOpen = new Set()

function getInputs(type) {
    return fs.readFileSync(`${__dirname}/${type}.txt`, 'utf8')
        .split(/\r?\n/)
        .map(row => {
            const matches = row.match(/Valve (\w+) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.*)/)
            const details = {
                name: matches[1],
                flowRate: parseInt(matches[2]),
                tunnels: matches[3].split(', ')
            }
            if (details.flowRate > 0) valvesLeftToOpen.add(details.name)
            return details
        })
}

function findValve(name) {
    return inputs.find(v => v.name === name)
}

const paths = []

function bestFlowChoice(position, remainingTime, valvesLeftToOpen, totalFlowRate, visitedSinceLastValve = '') {
    if (remainingTime <= 0 || valvesLeftToOpen.size === 0) {
        return { totalFlowRate: totalFlowRate }
    }
    const choices = []
    // when you do not open this one
    for (const tunnel of position.tunnels) {
        // avoid turning right back around if you didn't open this one (wasteful travel)
        if (visitedSinceLastValve.indexOf(`|${tunnel}|`) === -1) {
            choices.push(bestFlowChoice(findValve(tunnel), remainingTime - 1, new Set(valvesLeftToOpen.values()), totalFlowRate, visitedSinceLastValve + `|${position.name}|`))
        }
    }
    // when you do open this one
    if (valvesLeftToOpen.has(position.name) && remainingTime > 0) {
        remainingTime--
        if (remainingTime > 0) {
            for (const tunnel of position.tunnels) {
                const newValvesLeftToOpen = new Set(valvesLeftToOpen.values())
                newValvesLeftToOpen.delete(position.name)
                choices.push(bestFlowChoice(findValve(tunnel), remainingTime - 1, newValvesLeftToOpen, totalFlowRate + position.flowRate * remainingTime, `|${position.name}|`))
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
console.log(`Ran for ${duration}ms`)
console.log(`Answer for part 1: ${bestForPart1.totalFlowRate}`)
