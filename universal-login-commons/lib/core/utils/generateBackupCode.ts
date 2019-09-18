import {utils} from 'ethers';

const {bigNumberify} = utils;

const consonants: string = 'bcdfghjklmnprstvwz';
const vowels: string = 'aeiouy';

export function getSyllables() {
  const syllables: string[] = [];

  for (let a = 0; a < vowels.length; a++) {
    for (let b = 0; b < consonants.length; b++) {
      syllables.push(vowels[a] + consonants[b]);
    }
  }

  for (let b = 0; b < consonants.length; b++) {
    for (let a = 0; a < vowels.length; a++) {
      syllables.push(consonants[b] + vowels[a]);
    }
  }

  for (let b = 0; b < consonants.length; b++) {
    for (let a = 0; a < vowels.length; a++) {
      for (let e = 0; e < vowels.length; e++) {
        syllables.push(consonants[b] + vowels[a] + vowels[e]);
      }
    }
  }

  for (let b = 0; b < consonants.length; b++) {
    for (let a = 0; a < vowels.length; a++) {
      for (let c = 0; c < consonants.length; c++) {
        syllables.push(consonants[b] + vowels[a] + consonants[c]);
      }
    }
  }

  for (let a = 0; a < vowels.length; a++) {
    for (let b = 0; b < consonants.length; b++) {
      for (let e = 0; e < vowels.length; e++) {
        syllables.push(vowels[a] + consonants[b] + vowels[e]);
      }
    }
  }
  return syllables;
}

export function fromBase(bigNum: utils.BigNumber, base: utils.BigNumber) {
  const result: number[] = [];
  if (bigNum.eq(0)) {
    return [0];
  }
  for (let i = bigNum; i.gt(0); i = i.div(base)) {
    result.unshift(i.mod(base).toNumber());
  }
  return result;
}

function isConsonant(letter: string) {
  return consonants.indexOf(letter) >= 0;
}

export function toWords(number: utils.BigNumber) {
  const syllables = getSyllables();
  const numberArray: number[] = fromBase(number, bigNumberify(syllables.length));
  let result = '';
  let lastWord = '';
  let n = 0;
  for (let i = 0; i < numberArray.length; i++) {
    n = numberArray[i] || 0;

    lastWord = result.split(' ').slice(-1)[0];

    if (
      result === '' ||
      lastWord.length === syllables[n].length ||
      (lastWord.length < 5 &&
        isConsonant(lastWord.slice(-1)) &&
        isConsonant(syllables[n].slice(0, 1)))
    ) {
      result += syllables[n];
    } else {
      result += ` ${syllables[n]}`;
    }
  }
  return result.replace(/\b[a-z]/g, function (f) {
    return f.toUpperCase();
  });
}

export function fromWords(words: string) {
  const wordArray = words
    .toLowerCase()
    .replace(/[bcdfghjklmnprstvwz][bcdfghjklmnprstvwz]/gi, function (r) {
      const n = Math.floor(r.length / 2);
      return `${r.substr(0, n)} ${r.substr(n, n)}`;
    })
    .replace(/[a-z]{6}|[a-z]{4}/gi, function (r) {
      const n = Math.floor(r.length / 2);
      return `${r.substr(0, n)} ${r.substr(n, n)}`;
    })
    .split(' ');
  let result = bigNumberify(0);

  const syllables = getSyllables();
  for (let i = 0; i < wordArray.length; i++) {
    if (syllables.indexOf(wordArray[i]) < 0) {
      return;
    }

    const magnitude = bigNumberify(syllables.length).pow(bigNumberify(wordArray.length - i - 1));
    result = result.add(bigNumberify(syllables.indexOf(wordArray[i])).mul(magnitude));
  }

  return bigNumberify(result);
}

export function generateBackupCode(
  random1: utils.BigNumber = bigNumberify(utils.randomBytes(8)),
  random2: utils.BigNumber = bigNumberify(utils.randomBytes(8))
) {
  const prefix = toWords(random1)
    .replace(/\s/g, '-')
    .toLowerCase();
  const suffix = toWords(random2)
    .replace(/\s/g, '-')
    .toLowerCase();
  return `${prefix}-${suffix}`;
}
