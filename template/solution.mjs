import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const ResultTypes = {
    Sample: 'sample',
    Real: 'input'
}

const DebugOptions = {
    Disabled: 'Debugging is disabled',
    SampleOnly: 'Only produces debug output for "sample" input',
    Verbose: 'Enables all debug output'
}

function printHeader(message) {
    const displayWidth = 30
    const leftMessage = message.substr(0, Math.floor(message.length / 2))
    const rightMessage = message.substr(leftMessage.length)
    const leftDisplay = `${(new Array((displayWidth / 2) - leftMessage.length)).fill(' ').join('')}${leftMessage}`
    const rightDisplay = `${rightMessage}${(new Array((displayWidth / 2) - rightMessage.length)).fill(' ').join('')}`
    console.log(`\n###${(new Array(displayWidth)).fill('#').join('')}###`)
    console.log(`## ${leftDisplay}${rightDisplay} ##`)
    console.log(`###${(new Array(displayWidth)).fill('#').join('')}###`)
}

function getRows(fileShortName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = `${__dirname}/${fileShortName}.txt`

    return readFileSync(filePath, 'utf8').split(/\r?\n/)
}

function debugOutput(message, resultType) {
    if (DEBUG_LEVEL === DebugOptions.Verbose || DEBUG_LEVEL === DebugOptions.SampleOnly && (!resultType || resultType === ResultTypes.Sample)) {
        console.log(message)
    }
}

function getSamplePrefix(resultType) {
    return resultType === ResultTypes.Sample ? 'SAMPLE: ' : ''
}

function checkResult(part, resultType, expected, actual) {
    const logPrefix = getSamplePrefix(resultType)
    let expectation = `expected ${expected}`
    if (expected == '?') {
        console.error(`${logPrefix}No expectation set`)
        expectation = 'no expectation set'
    }
    console.info(`${logPrefix}Answer for part ${part}: ${actual}    (${expectation})`)

    if (expected != '?' && actual !== expected) {
        console.error('Actual does not match the expectation!!!')
        process.exit(1)
    }
}

function getTimingLabel(resultType, part) {
    return `** ${getSamplePrefix(resultType)}Part ${part}`
}

function doPart(part, resultType, expected) {
    const timingLabel = getTimingLabel(resultType, part)
    if (INCLUDE_TIMING) {
        console.time(timingLabel)
    }
    let actual
    if (part === 1) {
        throw 'Part 1 not implemented!!!'
        actual = '?'
    } else {
        throw 'Part 2 not implemented!!!'
        actual = '?'
    }
    if (INCLUDE_TIMING) {
        console.timeEnd(timingLabel)
    }
    checkResult(part, resultType, expected, actual)
}

const DEBUG_LEVEL = DebugOptions.SampleOnly
const INCLUDE_TIMING = true

printHeader("Part 1")
doPart(1, ResultTypes.Sample, '?')
doPart(1, ResultTypes.Real, '?')

printHeader("Part 2")
doPart(2, ResultTypes.Sample, '?')
doPart(2, ResultTypes.Real, '?')
