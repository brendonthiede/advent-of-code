fs = require('fs')

const rawCmds = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('$ ')

const filePattern = new RegExp(/^([0-9]+) ([a-zA-Z0-9.]+)$/)

let currentDir = ''
let allDirs = []
const files = []
rawCmds.forEach(element => {
    const lines = element.split(/\r?\n/)
    const cmd = lines[0]
    if (cmd.length === 0) {
        return
    } else if (cmd === 'ls') {
        // look for files
        lines.forEach(line => {
            const match = filePattern.exec(line)
            if (match) {
                files.push({
                    parent: currentDir,
                    name: match[2],
                    size: parseInt(match[1])
                })
            }
        })
    } else if (/cd .*/.test(cmd)) {
        // change directory
        const dir = cmd.split(' ')[1]
        if (dir === '..') {
            // go back to parent
            currentDir = currentDir.split('/').slice(0, -1).join('/')
            currentDir = currentDir.length === 0 ? '/' : currentDir
        } else if (dir[0] === '/') {
            // set absolute path
            currentDir = dir
        } else {
            // set relative path
            currentDir += (currentDir[currentDir.length - 1] === '/' ? '' : '/') + dir
        }
        allDirs.push(currentDir)
    }
});

const dirSizes = allDirs.filter((item, index) => allDirs.indexOf(item) === index).map(dir => {
    return {
        dir: dir,
        size: files.filter(file => (new RegExp(`^${dir}(/.*)?$`)).test(file.parent)).reduce((a, b) => a + b.size, 0)
    }
})

console.log("Answer for part 1: " + dirSizes.filter(dir => dir.size <= 100000).reduce((a, b) => a + b.size, 0))

const usedSpace = files.reduce((a, b) => a + b.size, 0)
const spaceToFree = usedSpace - (70000000 - 30000000)
const closestDir = dirSizes.filter(dir => dir.size > spaceToFree).sort((a, b) => a.size - b.size)[0]

console.log("Answer for part 2: " + (closestDir.size))