const fs = require('fs');

function sum(arr) {
  return arr.reduce((acc, a) => acc + a);
}

function count(arr, item) {
  return arr.filter((i) => i === item).length;
}

function min(arr, key = (x) => x) {
  return arr.reduce((acc, a) => (key(acc) < key(a) ? acc : a));
}

function read(path) {
  return fs.readFileSync(path, { encoding: 'utf-8' });
}

function getIntCode(path) {
  const data = read(path);
  return parseIntCode(data.trim());
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

function parseIntCode(codeStr) {
  return codeStr.split(',').map((val) => parseInt(val.trim()));
}

function mergesort(items, key = (a) => a, comparator = (a, b) => a < b) {
  sort(items, [...items], 0, items.length - 1);

  function merge(items, aux, firstLeft, firstRight, last) {
    for (let x = firstLeft; x <= last; x++) {
      aux[x] = items[x];
    }
    let [i, j] = [firstLeft, firstRight];
    for (let k = firstLeft; k <= last; k++) {
      if (i >= firstRight) {
        items[k] = aux[j++];
      } else if (j > last) {
        items[k] = aux[i++];
      } else if (comparator(key(aux[j]), key(aux[i]))) {
        // for stability, we only choose the 'right' item
        // when it is smaller than the 'left' item.
        items[k] = aux[j++];
      } else {
        items[k] = aux[i++];
      }
    }
  }

  function sort(items, aux, first, last) {
    if (last <= first) return;
    const startRight = first + Math.trunc((last - first) / 2) + 1;
    sort(items, aux, first, startRight - 1);
    sort(items, aux, startRight, last);
    merge(items, aux, first, startRight, last);
  }
}

module.exports = {
  sum,
  min,
  read,
  getIntCode,
  divmod,
  getUserInput,
  permute,
  count,
  parseIntCode,
  mergesort,
};
