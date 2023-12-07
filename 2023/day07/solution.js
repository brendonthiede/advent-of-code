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

function getScore(hand) {
  const cardValues = hand.split('').map((card) => card === 'T' ? 10 : card === 'J' ? 11 : card === 'Q' ? 12 : card === 'K' ? 13 : card === 'A' ? 14 : parseInt(card))
  const uniqueCounts = [...new Set(cardValues)]
    .map((card) => { return { card, count: cardValues.filter((c) => c === card).length }; })
    .sort((a, b) => b.count - a.count);

  // get the overall hand type score, then convert to hex and append each card in order as hex value
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

input.map((hand) => {
  const score = getScore(hand.hand);
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
  const tableData = input.map((hand) => {
    return {
      'Rank': hand.rank,
      'Hand': hand.hand,
      'Type': hand.type,
      'Score': hand.score,
      'Bid': hand.bid,
      'Points': hand.points
    };
  });
  console.table(input);
}

const part1 = input.reduce((acc, hand) => acc + hand.points, 0);

if (inputType === 'sample') {
  console.log(`Answer for part 1: ${part1} (should be 6440)`);
} else {
  console.log(`Answer for part 1: ${part1} (should be 249748283)`);
}
