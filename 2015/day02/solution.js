fs = require('fs')
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split(/\r?\n/).map((val) => val.split('x').map((val) => parseInt(val)))

function getWrappingPaperNeeded(packageDimensions) {
    const [l, w, h] = packageDimensions
    const sides = [l * w, w * h, h * l]
    return sides.reduce((a, b) => a + b, 0) * 2 + Math.min(...sides)
}

function getRibbonNeeded(packageDimensions) {
    const [l, w, h] = packageDimensions.sort((a, b) => a - b)
    const shortestPerimeter = 2 * (packageDimensions[0] + packageDimensions[1])
    const volume = l * w * h
    return shortestPerimeter + volume
}


console.log("Answer for part 1: " + inputs.reduce((total, packageDimensions) => total + getWrappingPaperNeeded(packageDimensions), 0))
console.log("Answer for part 2: " + inputs.reduce((total, packageDimensions) => total + getRibbonNeeded(packageDimensions), 0))
