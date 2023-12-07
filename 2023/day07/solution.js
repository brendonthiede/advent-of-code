fs = require('fs');

// check for optional command line argument
let defaultInputType = 'input';
let inputType = defaultInputType;
if (process.argv.length > 2) {
  inputType = process.argv[2].replace(/\..{3}$/, '');
}

let DEBUG = false;
if (inputType === 'sample' || process.argv.length > 3) {
  DEBUG = true;
}

const input = fs.readFileSync(`${__dirname}/${inputType}.txt`, 'utf8')
  .split(/\r?\n/)
  .map((line) => {
    const [hand, bid] = line.split(' ')
    return { hand, bid: parseInt(bid) }
  });

function getScore(hand, isJWild) {
  const cardValues = hand.split('').map((card) => card === 'T' ? 10 : card === 'J' ? (isJWild ? 1 : 11) : card === 'Q' ? 12 : card === 'K' ? 13 : card === 'A' ? 14 : parseInt(card))
  let uniqueCounts = [...new Set(cardValues)]
    .map((card) => { return { card, count: cardValues.filter((c) => c === card).length }; })
    .sort((a, b) => {
      if (a.count === b.count) {
        return b.card - a.card;
      }
      return b.count - a.count
    });

  if (isJWild && uniqueCounts.find((card) => card.card === 1)) {
    if (DEBUG) {
      const tableData = uniqueCounts.map((card) => {
        return {
          'Count': card.count,
          'Card': card.card
        };
      }).sort((a, b) => b.Count - a.Count);
      console.table(tableData);
    }
  
    if (uniqueCounts.length > 1) {
      // find the card, other than 1, that has the highest count
      const highCard = uniqueCounts[uniqueCounts.findIndex((card) => card.card !== 1)].card;
      // switch all 1's to be whatever the highest count of cards is, but keep original values for overall scoring
      const wildCardValues = [...cardValues];
      wildCardValues.forEach((card, index) => { if (card === 1) wildCardValues[index] = highCard; });
      uniqueCounts = [...new Set(wildCardValues)]
        .map((card) => { return { card, count: wildCardValues.filter((c) => c === card).length }; })
        .sort((a, b) => {
          if (a.count === b.count) {
            return b.card - a.card;
          }
          return b.count - a.count
        });
    }
  }

  // get the overall hand type score, then convert to hex and append each card in order as hex value
  // NOTE: nothing special about hex, but it makes it easy to combine, since each placeholder will be a single digit due to the value being between 2 and 14
  let typeScore = 0;
  let type = '';
  if (uniqueCounts.length === 1) {
    // five of a kind
    typeScore = 6;
    type = 'five of a kind';
  } else if (uniqueCounts.length === 2) {
    if (uniqueCounts[0].count === 4) {
      // four of a kind
      typeScore = 5;
      type = 'four of a kind';
    } else {
      // full house
      typeScore = 4;
      type = 'full house';
    }
  } else if (uniqueCounts.length === 3) {
    if (uniqueCounts[0].count === 3) {
      // three of a kind
      typeScore = 3;
      type = 'three of a kind';
    } else {
      // two pair
      typeScore = 2;
      type = 'two pair';
    }
  } else if (uniqueCounts.length === 4) {
    // one pair
    typeScore = 1;
    type = 'one pair';
  } else {
    // high card
    typeScore = 0;
    type = 'high card';
  }

  // convert to hex and append each card from hand in order as hex value
  let score = typeScore.toString(16);
  cardValues.forEach((card) => {
    score += card.toString(16);
  });
  // convert to decimal
  score = parseInt(score, 16);

  return {
    score, type
  };
}

function getAnswer(input, isJWild) {
  const resultSet = input.slice(0);
  resultSet.map((hand) => {
    const score = getScore(hand.hand, isJWild);
    hand.score = score.score;
    hand.type = score.type;
    return hand;
  })
    .sort((a, b) => a.score - b.score)
    .map((hand, index) => {
      hand.rank = index + 1;
      hand.points = hand.bid * hand.rank;
      return hand;
    });

  if (DEBUG) {
    const tableData = resultSet.map((hand) => {
      return {
        'Rank': hand.rank,
        'Hand': hand.hand,
        'Type': hand.type,
        'Score': hand.score,
        'Bid': hand.bid,
        'Points': hand.points
      };
    }).sort((a, b) => a.Rank - b.Rank);
    console.table(tableData);
  }

  return resultSet.reduce((acc, hand) => acc + hand.points, 0);
}

const part1 = getAnswer(input, false);
const part2 = getAnswer(input, true);

if (inputType === 'sample') {
  console.log(`Answer for part 1: ${part1} (should be 6440)`);
  console.log(`Answer for part 2: ${part2} (should be 5905)`);
} else {
  console.log(`Answer for part 1: ${part1} (should be 249748283)`);
  console.log(`Answer for part 2: ${part2} (should be higher than 248029057)`);
}
