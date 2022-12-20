const fs = require('fs')

function getInputs(type) {
    const neighbors = new Map(), rates = new Map()
    return fs.readFileSync(`${__dirname}/${type}.txt`, 'utf8')
        .split(/\r?\n/)
        .map(row => {
            const matches = row.match(/Valve (\w+) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.*)/)
            const details = {
                name: matches[1],
                flowRate: parseInt(matches[2]),
                tunnels: matches[3].split(', ')
            }
            return details
        })
        .reduce((acc, details) => {
            acc.neighbors.set(details.name, details.tunnels)
            acc.rates.set(details.name, details.flowRate)
            return acc
        }, { neighbors, rates })
}

const breadthFirstSearch = (neighbors, startNode, targetNode) => {
    const queue = []
    const visited = [startNode]

    if (startNode !== targetNode)
        queue.push([startNode])

    while (queue.length > 0) {
        const path = queue.shift()
        const node = path[path.length - 1]

        for (let neighbor of neighbors.get(node)) {
            if (visited.includes(neighbor)) continue

            if (neighbor == targetNode) return path.concat([neighbor])
            visited.push(neighbor)
            queue.push(path.concat([neighbor]))
        }
    }

    return [startNode]
}

const findRates = (distances, startNode, time, leftToOpen, alreadyOpened = new Map()) => {
    const allRates = [alreadyOpened]

    leftToOpen.forEach((targetNode, index) => {
        const remainingTime = time - 1 - distances.get(startNode).get(targetNode)
        if (remainingTime <= 0) return
        const stillLeftToOpen = leftToOpen.filter((_, i) => i !== index)
        const nowOpened = (new Map([...alreadyOpened.entries()])).set(targetNode, remainingTime)
        allRates.push(...findRates(distances, targetNode, remainingTime, stillLeftToOpen, nowOpened))
    })

    return allRates
}

function getBestPath(input, timeLimit, hasHelper = false) {
    const distances = new Map()
    const allTunnels = [...input.neighbors.keys()]
    allTunnels.forEach(startNode => {
        allTunnels.forEach(targetNode => {
            if (!distances.has(startNode)) distances.set(startNode, new Map())
            distances.get(startNode).set(targetNode, breadthFirstSearch(input.neighbors, startNode, targetNode).length - 1)
        })
    })

    let valuableTunnels = allTunnels.filter(key => input.rates.get(key) > 0)
    let allRates = findRates(distances, 'AA', timeLimit, valuableTunnels)

    if (!hasHelper) {
        const bestRates = allRates.map(journey =>
            [...journey.entries()]
                .map(([key, value]) => input.rates.get(key) * value)
                .reduce((acc, value) => acc + value, 0))
        return Math.max(...bestRates)
    }

    const bestFlows = new Map()
    allRates.forEach(rate => {
        let nodes = [...rate.keys()].sort().join(',')
        if (nodes.length === 0) return
        const flowRate = [...rate.entries()].reduce((acc, [key, value]) => acc + input.rates.get(key) * value, 0)

        bestFlows.set(nodes, Math.max(flowRate, bestFlows.has(nodes) ? bestFlows.get(nodes) : 0))
    })

    const bestFlowsKeys = [...bestFlows.keys()]
    let highest = 0
    bestFlowsKeys.forEach(myPath => {
        bestFlowsKeys.forEach(helperPath => {
            const myValves = myPath.split(',')
            const helperValves = helperPath.split(',')
            const allValves = new Set(myValves.concat(helperValves))

            if (allValves.size == (myValves.length + helperValves.length)) {
                highest = Math.max(bestFlows.get(myPath) + bestFlows.get(helperPath), highest)
            }
        })
    })

    return highest
}


const inputType = 'input'
const inputs = getInputs(inputType)

const part1 = getBestPath(inputs, 30, false)
if (inputType === 'sample' && part1 != 1651) {
    throw new Error(`Part 1 failed: expected 1651 but got ${part1}`)
}
console.log(`Answer for part 1: ${part1}`)

const part2 = getBestPath(inputs, 26, true)
if (inputType === 'sample' && part2 != 1707) {
    throw new Error(`Part 2 failed: expected 1707 but got ${part2}`)
}
console.log(`Answer for part 2: ${part2}`)
