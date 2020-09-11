const fs = require('fs');
const readline = require('readline');

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
function mod(a, b) {
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

module.exports = { sum, min, read, getIntCode, mod, getUserInput };
