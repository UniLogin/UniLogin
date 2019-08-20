/* eslint-disable */

/*
Daefen
------
A library for encoding/decoding large numbers into/from a pronounceable high-density string constructed from a base of 3456 syllables.
*/

// Creates the syllable array
var syllables = [];
var consonants = "bcdfghjklmnprstvwz"; // consonants that are unambiguous and easy to pronounce
var vowels = "aeiouy"; // vowels

// Vowel + Consonant
for (var a = 0; a < vowels.length; a++) {
  for (var b = 0; b < consonants.length; b++) {
    syllables.push(vowels[a] + consonants[b]);
  }
}

// Consonant + Vowel
for (var b = 0; b < consonants.length; b++) {
  for (var a = 0; a < vowels.length; a++) {
    syllables.push(consonants[b] + vowels[a]);
  }
}

// Consonant + Vowel + Vowel
for (var b = 0; b < consonants.length; b++) {
  for (var a = 0; a < vowels.length; a++) {
    for (var e = 0; e < vowels.length; e++) {
      syllables.push(consonants[b] + vowels[a] + vowels[e]);
    }
  }
}

// Consonant + Vowel + Consonant
for (var b = 0; b < consonants.length; b++) {
  for (var a = 0; a < vowels.length; a++) {
    for (var c = 0; c < consonants.length; c++) {
      syllables.push(consonants[b] + vowels[a] + consonants[c]);
    }
  }
}

// Vowel + Consonant + Vowel
for (var a = 0; a < vowels.length; a++) {
  for (var b = 0; b < consonants.length; b++) {
    for (var e = 0; e < vowels.length; e++) {
      syllables.push(vowels[a] + consonants[b] + vowels[e]);
    }
  }
}

// Quick function that converts a big Number object into an array of numbers for any chosen base
function fromBase10(bigNum, base) {
  var result = [];
  if (bigNum == 0) return [0];
  for (var i = bigNum; i > 0; i = Math.floor(i / base)) {
    result.unshift(i % base);
  }
  return result;
}

// Important to check some spacing issues
function isConsonant(letter) {
  return consonants.indexOf(letter) >= 0;
}

// Converts an integer (passed as a string to avoid scientific notation issues)
function toWords(number) {
  let numberArray = fromBase10(number, syllables.length);
  let result = "";
  let lastWord = "";
  let n = 0;
  for (var i = 0; i < numberArray.length; i++) {
    n = numberArray[i] || 0;

    lastWord = result.split(" ").slice(-1)[0];

    if (
      result == "" ||
      lastWord.length == syllables[n].length ||
      (lastWord.length < 5 &&
        isConsonant(lastWord.slice(-1)) &&
        isConsonant(syllables[n].slice(0, 1)))
    ) {
      result += syllables[n];
    } else {
      result += " " + syllables[n];
    }
  }
  return result.replace(/\b[a-z]/g, function(f) {
    return f.toUpperCase();
  });
}

// Converts a valid phrase back into a string
function fromWords(words) {
  let wordArray = words

    .replace(/[bcdfghjklmnprstvwz][bcdfghjklmnprstvwz]/gi, function(r) {
      let n = Math.floor(r.length / 2);
      return r.substr(0, n) + " " + r.substr(n, n);
    })
    .replace(/[a-z]{6}|[a-z]{4}/gi, function(r) {
      let n = Math.floor(r.length / 2);
      return r.substr(0, n) + " " + r.substr(n, n);
    })
    .split(" ");
  let result = 0;

  for (var i = 0; i < wordArray.length; i++) {
    if (syllables.indexOf(wordArray[i]) < 0) return;

    result =
      result +
      syllables.indexOf(wordArray[i]) *
        Math.pow(syllables.length, wordArray.length - i - 1);
  }

  return result;
}

export {fromWords, toWords};