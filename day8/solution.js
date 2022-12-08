fs = require('fs')

forest = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => line.split('').map(height => {
        return {
            height: parseInt(height),
            visible: false
        }
    }))

function markVisibleLeftToRight(forest) {
    for (let x = 0; x < forest[0].length; x++) {
        for (let y = 0; y < forest.length; y++) {
            if (x === 0 || y === 0 || x === forest[0].length - 1 || y === forest.length - 1) {
                forest[y][x].visible = true
                continue
            }
            const treeHeight = forest[y][x].height

            const blockingTreesToTheLeft = forest[y].slice(0, x).filter(tree => tree.height >= treeHeight).length
            if (blockingTreesToTheLeft === 0) {
                forest[y][x].visible = true
                continue
            }

            const blockingTreesToTheRight = forest[y].slice(x + 1).filter(tree => tree.height >= treeHeight).length
            if (blockingTreesToTheRight === 0) {
                forest[y][x].visible = true
                continue
            }
        }
    }
}

markVisibleLeftToRight(forest)
// rotate the forest 90 degrees clockwise
forest = forest[0].map((_, colIndex) => forest.map(row => row[colIndex]));
markVisibleLeftToRight(forest)
const visibleTrees = forest.reduce((a, b) => a + b.filter(tree => tree.visible).length, 0)
console.log(`Answer for part 1: ${visibleTrees}`)

let bestScore = 0
for (let x = 1; x < forest[0].length - 1; x++) {
    for (let y = 1; y < forest.length - 1; y++) {
        const treeHeight = forest[y][x].height
        let leftScore = x
        for (let i = x - 1; i >= 0; i--) {
            if (forest[y][i].height >= treeHeight) {
                leftScore = x - i
                break
            }
        }

        let rightScore = forest[0].length - x - 1
        for (let i = x + 1; i < forest[0].length; i++) {
            if (forest[y][i].height >= treeHeight) {
                rightScore = i - x
                break
            }
        }

        let upScore = y
        for (let j = y - 1; j >= 0; j--) {
            if (forest[j][x].height >= treeHeight) {
                upScore = y - j
                break
            }
        }

        let downScore = forest.length - y - 1
        for (let j = y + 1; j < forest.length; j++) {
            if (forest[j][x].height >= treeHeight) {
                downScore = j - y
                break
            }
        }

        const score = leftScore * rightScore * upScore * downScore
        if (score > bestScore) {
            bestScore = score
        }
    }
}


forest = forest[0].map((_, colIndex) => forest.map(row => row[colIndex]));
forest = forest[0].map((_, colIndex) => forest.map(row => row[colIndex]));
forest = forest[0].map((_, colIndex) => forest.map(row => row[colIndex]));

// printForest(forest)
console.log(`Answer for part 2: ${bestScore}`)