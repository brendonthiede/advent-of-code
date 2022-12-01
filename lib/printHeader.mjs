export default function printHeader(message, width) {
    const displayWidth = width ? width : 30
    const leftMessage = message.substr(0, Math.floor(message.length / 2))
    const rightMessage = message.substr(leftMessage.length)
    const leftDisplay = `${(new Array((displayWidth / 2) - leftMessage.length)).fill(' ').join('')}${leftMessage}`
    const rightDisplay = `${rightMessage}${(new Array((displayWidth / 2) - rightMessage.length)).fill(' ').join('')}`
    console.log(`\n###${(new Array(displayWidth)).fill('#').join('')}###`)
    console.log(`## ${leftDisplay}${rightDisplay} ##`)
    console.log(`###${(new Array(displayWidth)).fill('#').join('')}###`)
}
