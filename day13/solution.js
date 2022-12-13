fs = require('fs')
const pairs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .replace(/\[/g, '[,')
    .replace(/]/g, ',]')
    .replace(/,,/g, ',')
    .split(/\r?\n\r?\n/)
    .map(x => x.split(/\r?\n/))

let orderedPairs = []

function isSorted(a, b) {
    let lhs = a.slice()
    let rhs = b.slice()
    let inOrder = true
    while (lhs.length > 0 && rhs.length > 0) {
        const lhsVal = lhs.shift()
        const rhsVal = rhs.shift()

        if (lhsVal === rhsVal) continue

        // === both are numbers ===
        if (!isNaN(lhsVal) && !isNaN(rhsVal)) {
            if (parseInt(lhsVal) < parseInt(rhsVal)) {
                inOrder = true
                lhs = []
                break
            } else {
                inOrder = false
                break
            }
        }

        // === start of list with mixed types ===
        if (lhsVal === '[' && !isNaN(rhsVal)) {
            rhs.splice(0, 0, ']')
            rhs.splice(0, 0, rhsVal)
            continue
        }

        if (!isNaN(lhsVal) && rhsVal === '[') {
            lhs.splice(0, 0, ']')
            lhs.splice(0, 0, lhsVal)
            continue
        }

        // === end of list ===
        // lhs is shorter
        if (lhsVal === ']' && rhsVal !== ']') {
            inOrder = true
            lhs = []
            break
        }

        // rhs is shorter
        else if (lhsVal !== ']' && rhsVal === ']') {
            inOrder = false
            break
        }
    }

    return inOrder && lhs.length <= rhs.length ? -1 : 1
}

pairs.forEach((pair, index) => {
    let lhs = pair[0].split(',').map(val => isNaN(val) ? val : parseInt(val))
    let rhs = pair[1].split(',').map(val => isNaN(val) ? val : parseInt(val))

    if (isSorted(lhs, rhs) < 0) orderedPairs.push(index + 1)
})

console.log(`Answer for part 1 should be 5760`)
console.log(`Answer for part 1: ${orderedPairs.reduce((a, b) => a + b, 0)}`)

function splitPacket(packet) {
    return packet
        .replace(/\[/g, '[,')
        .replace(/]/g, ',]')
        .replace(/,,/g, ',')
        .split(',')
}

const allPackets = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .replace(/\r?\n\r?\n/g, '\n')
    .split(/\r?\n/)
    .map(splitPacket)

allPackets.push(splitPacket('[[2]]'))
allPackets.push(splitPacket('[[6]]'))
allPackets.sort(isSorted)

const packetsAsStrings = allPackets.map((packet) => packet.join(',').replace(/[,]?([\[\]])[,]?/g, '$1'))

const firstMarkerPosition = packetsAsStrings.indexOf('[[2]]') + 1
const secondMarkerPosition = packetsAsStrings.indexOf('[[6]]') + 1
console.log(`Answer for part 2 should be 26670`)
console.log(`Answer for part 2: ${firstMarkerPosition * secondMarkerPosition}`)