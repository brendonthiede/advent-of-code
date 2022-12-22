const POSSIBLE_DIRECTIONS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
const EMPTY_SPACE = 'empty space'

function getExposedSurfaceArea(cubes) {
    return cubes.reduce((surfaceArea, position) => {
        POSSIBLE_DIRECTIONS.forEach(direction => {
            if (!cubes.includes(getNeighborCoords(position, direction))) surfaceArea++
        })
        return surfaceArea
    }, 0)
}

function markOutsideSpace(cubes, extremes) {
    cubes.set(`${extremes[0][0]},${extremes[1][0]},${extremes[2][0]}`, EMPTY_SPACE)

    let changeMade = true
    while (changeMade) {
        changeMade = false
        for (let x = extremes[0][0]; x <= extremes[0][1]; x++) {
            for (let y = extremes[1][0]; y <= extremes[1][1]; y++) {
                for (let z = extremes[2][0]; z <= extremes[2][1]; z++) {
                    const coords = `${x},${y},${z}`
                    if (cubes.get(`${x},${y},${z}`) === false) {
                        POSSIBLE_DIRECTIONS.forEach(direction => {
                            const neighborCoords = `${x + direction[0]},${y + direction[1]},${z + direction[2]}`
                            if (cubes.get(neighborCoords) === EMPTY_SPACE) {
                                cubes.set(coords, EMPTY_SPACE)
                                changeMade = true
                            }
                        })
                    }
                }
            }
        }
    }
}

function getNeighborCoords(position, direction) {
    return position.split(',').map(Number).map((axis, i) => axis + direction[i],).join(',')
}

function getExteriorSurfaceArea(input) {
    const cubes = new Map()

    const extremes = input.reduce((extremes, cube) => {
        const axes = cube.split(',').map(Number)
        for (let axis = 0; axis < 3; axis++) {
            if (extremes.length > axis) {
                extremes[axis][0] = Math.min(extremes[axis][0], axes[axis] - 1)
                extremes[axis][1] = Math.max(extremes[axis][1], axes[axis] + 1)
            } else {
                extremes[axis] = [axes[axis], axes[axis]]
            }
        }
        return extremes
    }, [])

    for (let x = extremes[0][0]; x <= extremes[0][1]; x++) {
        for (let y = extremes[1][0]; y <= extremes[1][1]; y++) {
            for (let z = extremes[2][0]; z <= extremes[2][1]; z++) {
                cubes.set(`${x},${y},${z}`, input.includes(`${x},${y},${z}`))
            }
        }
    }

    markOutsideSpace(cubes, extremes)

    return [...cubes.keys()].reduce((area, position) => {
        // ignore empty space
        if (cubes.get(position) === EMPTY_SPACE) return area

        // count any sides touching empty space
        POSSIBLE_DIRECTIONS.forEach(direction => {
            if (cubes.get(getNeighborCoords(position, direction)) === EMPTY_SPACE) area++
        })
        return area
    }, 0)
}

const fs = require('fs')
const cubes = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)

console.log(`Answer for part 1: ${getExposedSurfaceArea(cubes)}`)
console.log(`Answer for part 2: ${getExteriorSurfaceArea(cubes)}`)

