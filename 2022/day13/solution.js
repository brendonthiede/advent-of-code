fs = require('fs')

function splitPacket(packet) {
    return packet.replace(/\[/g, '[,').replace(/]/g, ',]').replace(/,,/g, ',').split(',')
}

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

        // === end of list ===
        if (lhsVal === ']') {
            // lhs is shorter
            inOrder = true
            lhs = []
            break
        } else if (rhsVal === ']') {
            // rhs is shorter
            inOrder = false
            break
        }

        // === mixed types ===
        if (lhsVal === '[') {
            rhs.splice(0, 0, ']')
            rhs.splice(0, 0, rhsVal)
            continue
        } else {
            lhs.splice(0, 0, ']')
            lhs.splice(0, 0, lhsVal)
            continue
        }
    }

    return inOrder && lhs.length <= rhs.length ? -1 : 1
}

const allPackets = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .replace(/\r?\n\r?\n/g, '\n')
    .split(/\r?\n/)
    .map(splitPacket)

const orderedPairs = []
for (let index = 0; index < allPackets.length / 2; index++) {
    if (isSorted(allPackets[index * 2], allPackets[index * 2 + 1]) < 0) orderedPairs.push(index + 1)
}

console.log(`Answer for part 1: ${orderedPairs.reduce((a, b) => a + b, 0)}`)

allPackets.push(splitPacket('[[2]]'))
allPackets.push(splitPacket('[[6]]'))
allPackets.sort(isSorted)

const packetsAsStrings = allPackets.map((packet) => packet.join(',').replace(/[,]?([\[\]])[,]?/g, '$1'))
const firstMarkerPosition = packetsAsStrings.indexOf('[[2]]') + 1
const secondMarkerPosition = packetsAsStrings.indexOf('[[6]]') + 1

console.log(`Answer for part 2: ${firstMarkerPosition * secondMarkerPosition}`)