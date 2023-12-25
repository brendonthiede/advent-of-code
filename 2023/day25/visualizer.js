const { readFileSync } = require('fs');
const { assert } = require('console');

// check for optional command line argument
let defaultInputType = 'sample';
let inputType = defaultInputType;
if (process.argv.length > 2) {
    inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (/sample.*/.test(inputType) || process.argv.length > 3) {
    DEBUG = true;
}

const input = readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
    .split(/\r?\n/)
    .map(row => {
        let [name, connections] = row.split(': ');
        connections = connections.split(' ');
        return {
            name,
            connections
        };
    });

console.log('graph {');
input.forEach(line => {
    line.connections.forEach(connection => {
        console.log(`    ${line.name} -- ${connection};`);
    });
});
console.log('}');
