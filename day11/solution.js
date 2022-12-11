fs = require('fs')

function monkeyBusiness(rounds, reliefLevel) {
    const monkeys = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n\r?\n/)
        .map(raw => {
            const pieces = raw.split(/\r?\n/)
            return {
                startingItems: pieces[1].split(': ')[1].split(', ').map(Number),
                operation: eval(`(old)=>${pieces[2].split(' new = ')[1]}`),
                divisibility: parseInt(pieces[3].split(' divisible by ')[1]),
                monkeyOnTrue: parseInt(pieces[4].split(' throw to monkey ')[1]),
                monkeyOnFalse: parseInt(pieces[5].split(' throw to monkey ')[1]),
                inspectionCount: 0
            }
        })

    const commonMultiple = monkeys.reduce((acc, monkey) => acc *= monkey.divisibility, 1);

    for (let round = 0; round < rounds; round++) {
        monkeys.forEach((monkey) => {
            monkey.inspectionCount += monkey.startingItems.length
            while (monkey.startingItems.length > 0) {
                // actual worry level doesn't matter, as long as the correct next monkey is chosen.
                //   removing multiples of the commonMultiple makes sure the number is small enough to fit in a 32-bit int while still
                //   being divisible by each "test" correctly
                const worryLevel = Math.floor(monkey.operation(monkey.startingItems.shift()) / reliefLevel) % commonMultiple
                const nextMonkey = worryLevel % monkey.divisibility === 0 ? monkey.monkeyOnTrue : monkey.monkeyOnFalse
                monkeys[nextMonkey].startingItems.push(worryLevel)
            }
        })
    }

    const inspectionCounts = monkeys.map((monkey) => monkey.inspectionCount).sort((a, b) => b - a)
    return inspectionCounts[0] * inspectionCounts[1]
}

console.log(`Answer for part 1: ${monkeyBusiness(20, 3)}`)
console.log(`Answer for part 2: ${monkeyBusiness(10000, 1)}`)
