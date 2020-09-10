function sum(arr) {
  return arr.reduce((acc, a) => acc + a);
}

function min(arr) {
  return arr.reduce((acc, a) => (acc < a ? acc : a));
}

module.exports = { sum, min };
