const fs = require('fs');
const data = fs.readFileSync('./day02/input.txt', { encoding: 'utf-8' });
const code = data
  .trim()
  .split(',')
  .map((val) => parseInt(val.trim()));

function run1(code) {
  function perform(op, first, second) {
    if (op === 1) return first + second;
    if (op === 2) return first * second;
  }
  let current = 0;
  while (code[current] !== 99) {
    code[code[current + 3]] = perform(
      code[current],
      code[code[current + 1]],
      code[code[current + 2]]
    );
    current += 4;
  }
  return code;
}

function output(noun, verb) {
  const codeCopy = [...code];
  codeCopy[1] = noun;
  codeCopy[2] = verb;
  const result = run1(codeCopy);
  return result[0];
}

console.log(output(12, 2));
// ans: 9581917

function findIt() {
  for (let i=0; i < 100; i++) {
    for (let j=0; j < 100; j++) {
      if (output(i, j) === 19690720) {
        console.log(100 * i + j)
        return;
      }
    }
  }
}

findIt();
// ans: 2505
