export default function assertEquals(actual, expected) {
    if (actual === expected) {
        console.log(`${actual} is the expected value.`)
    } else {
        console.error(`${actual} does not match the expected value of ${expected}`)
    }
}