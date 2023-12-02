fs = require('fs');
const inputs = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/);

function convertStringToObject(pull) {
    const result = {
        "red": 0,
        "green": 0,
        "blue": 0
    };
    const pairs = pull.map(str => str.trim());

    pairs.forEach(pair => {
        const [count, color] = pair.split(' ');
        result[color] += parseInt(count);
    });

    return result;
}

const games = inputs.map(line => {
    let [game, pulls] = line.split(': ');
    game = parseInt(game.split(' ')[1]);
    pulls = pulls.split(';')
        .map(pull => pull.split(','))
        .map(pull => convertStringToObject(pull));

    minimums = pulls.reduce((acc, pull) => {
        acc.red = Math.max(acc.red, pull.red);
        acc.green = Math.max(acc.green, pull.green);
        acc.blue = Math.max(acc.blue, pull.blue);
        return acc;
    }, { red: 0, green: 0, blue: 0 });

    power = minimums.red * minimums.green * minimums.blue;

    return { game, pulls, minimums, power };
});

const possibleGames = games.filter(game => {
    for (pull of game.pulls) {
        if (pull.red > 12 || pull.green > 13 || pull.blue > 14) {
            return false;
        }
    }
    return true;
});

console.log("Answer for part 1: " + possibleGames.reduce((total, game) => total + game.game, 0));
console.log("Answer for part 2: " + games.reduce((total, game) => total + game.power, 0));
