const { readFileSync } = require('fs');
const { assert } = require('console');

// Input handling (keeping your style)
let defaultInputType = 'input';
let inputType = defaultInputType;
if (process.argv.length > 2) {
    inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (/sample.*/.test(inputType) || process.argv.length > 3) {
    DEBUG = true;
}

// Parse input into structured data
const input = readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => {
        const [moduleStr, destStr] = line.split(' -> ');
        const destinations = destStr.split(', ');
        
        if (moduleStr === 'broadcaster') {
            return { type: 'broadcaster', name: 'broadcaster', destinations };
        }
        
        return {
            type: moduleStr[0],
            name: moduleStr.slice(1),
            destinations
        };
    });

class Module {
    constructor(type, name, destinations) {
        this.type = type;
        this.name = name;
        this.destinations = destinations;
        this.inputs = new Map();  // For conjunction modules
        this.state = false;       // For flip-flop modules (initially off)
    }

    process(pulse, from) {
        if (this.type === 'broadcaster') {
            return { send: true, pulse };
        }
        
        if (this.type === '%') {
            if (pulse === 1) return { send: false };  // High pulses are ignored
            this.state = !this.state;  // Flip state on low pulse
            return { send: true, pulse: this.state ? 1 : 0 };
        }
        
        if (this.type === '&') {
            this.inputs.set(from, pulse);
            const allHigh = [...this.inputs.values()].every(p => p === 1);
            return { send: true, pulse: allHigh ? 0 : 1 };
        }
        
        return { send: false };
    }
}

function setupModules(input) {
    const modules = new Map();
    
    // Create all modules
    input.forEach(({ type, name, destinations }) => {
        modules.set(type === 'broadcaster' ? 'broadcaster' : name, 
            new Module(type, name, destinations));
    });

    // Setup conjunction module inputs
    input.forEach(({ type, name, destinations }) => {
        const sourceName = type === 'broadcaster' ? 'broadcaster' : name;
        destinations.forEach(dest => {
            const destModule = modules.get(dest);
            if (destModule && destModule.type === '&') {
                destModule.inputs.set(sourceName, 0);  // Initially remember low pulse
            }
        });
    });

    return modules;
}

function pressButton(modules, findCycle = false) {
    const queue = [['button', 'broadcaster', 0]];
    let low = 1;  // Count initial button press
    let high = 0;
    const cycleStates = findCycle ? new Map() : null;
    const rxParent = findCycle ? [...modules.values()].find(m => m.destinations.includes('rx'))?.name : null;

    while (queue.length > 0) {
        const [from, to, pulse] = queue.shift();
        const module = modules.get(to);
        
        if (!module) continue;

        // For part 2 cycle detection
        if (findCycle && to === rxParent && pulse === 1) {
            cycleStates.set(from, pressCount);
        }

        const result = module.process(pulse, from);
        if (!result.send) continue;

        for (const dest of module.destinations) {
            if (result.pulse === 0) low++;
            else high++;
            queue.push([to, dest, result.pulse]);
        }
    }

    return { low, high, cycleStates };
}

// Part 1
let modules = setupModules(input);
let totalLow = 0, totalHigh = 0;

for (let i = 0; i < 1000; i++) {
    const { low, high } = pressButton(modules);
    totalLow += low;
    totalHigh += high;
}

const part1 = totalLow * totalHigh;

// Part 2 (keeping the working version)
modules = setupModules(input);
let part2 = null;
let pressCount = 0;
const rxModule = [...modules.values()].find(m => m.destinations.includes('rx'));

if (rxModule) {
    const cycles = new Map();
    while (cycles.size < modules.get(rxModule.name).inputs.size) {
        pressCount++;
        const { cycleStates } = pressButton(modules, true);
        if (cycleStates) {
            for (const [module, cycle] of cycleStates) {
                if (!cycles.has(module)) {
                    cycles.set(module, cycle);
                }
            }
        }
    }
    
    // Calculate LCM of all cycles
    part2 = [...cycles.values()].reduce((lcm, cycle) => {
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        return (lcm * cycle) / gcd(lcm, cycle);
    });
}

// Output handling (keeping your style)
const answers = {
    part1: {
        actual: part1,
        expected: {
            sample: 32000000,
            input: 747304011
        }
    },
    part2: {
        actual: part2,
        expected: {
            sample: null,
            input: 220366255099387
        }
    }
};

let expectedPart1 = answers.part1.expected[inputType];
let expectedPart2 = answers.part2.expected[inputType];

console.log(`Answer for part 1: ${answers.part1.actual}`);
if (expectedPart1 !== null) {
    console.log(`        should be: ${expectedPart1}`);
    assert(answers.part1.actual === expectedPart1);
}

if (answers.part2.actual !== null) {
    console.log(`Answer for part 2: ${answers.part2.actual}`);
    if (expectedPart2 !== null) {
        console.log(`        should be: ${expectedPart2}`);
        assert(answers.part2.actual === expectedPart2);
    }
}
