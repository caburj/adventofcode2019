const fs = require('fs');

function sum(arr) {
  return arr.reduce((acc, a) => acc + a);
}

function min(arr) {
  return arr.reduce((acc, a) => (acc < a ? acc : a));
}

function read(path) {
  return fs.readFileSync(path, { encoding: 'utf-8' });
}

function getIntCode(path) {
  const data = read(path);
  return data
    .trim()
    .split(',')
    .map((val) => parseInt(val.trim()));
}

/**
 * Returns the quotient and remainder after dividing two numbers.
 * @param {number} a
 * @param {number} b
 */
function divmod(a, b) {
  return [~~(a / b), a % b];
}

function getUserInput(msg) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(`${msg}`, (response) => {
      resolve(response);
      readline.close();
    });
  });
}

/**
 * Source: https://stackoverflow.com/questions/9960908/permutations-in-javascript
 */
function* permute(permutation) {
  var length = permutation.length,
    c = Array(length).fill(0),
    i = 1,
    k,
    p;

  yield permutation.slice();
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      yield permutation.slice();
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

module.exports = { sum, min, read, getIntCode, divmod, getUserInput, permute };
