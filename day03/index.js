// const fs = require('fs');
// const utils = require('../utils');
// const data = fs.readFileSync('./day03/input.txt', { encoding: 'utf-8' });
// const [firstWireStr, secondWireStr] = data.trim().split('\n');
// const firstWire = firstWireStr.trim().split(',');
// const secondWire = secondWireStr.trim().split(',');

// sample
const utils = require('../utils');
const firstWire = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(',');
const secondWire = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(',');

function combine(x, y) {
  return `${x}/${y}`;
}

function separate(str) {
  return str.split('/').map((comp) => parseInt(comp));
}

function getCoordSet(wire) {
  const set = new Set([]);
  let x = 0;
  let y = 0;
  for (const xxx of wire) {
    const dir = xxx[0];
    const length = parseInt(xxx.slice(1));
    switch (dir) {
      case 'R':
        for (let i = 0; i < length; i++) {
          x += 1;
          set.add(combine(x, y));
        }
        break;
      case 'L':
        for (let i = 0; i < length; i++) {
          x -= 1;
          set.add(combine(x, y));
        }
        break;
      case 'U':
        for (let i = 0; i < length; i++) {
          y += 1;
          set.add(combine(x, y));
        }
        break;
      case 'D':
        for (let i = 0; i < length; i++) {
          y -= 1;
          set.add(combine(x, y));
        }
        break;
    }
  }
  return set;
}

const firstWireCoords = getCoordSet(firstWire);
const secondWireCoords = getCoordSet(secondWire);

const intersections = new Set([]);

for (let coord of secondWireCoords) {
  if (firstWireCoords.has(coord)) {
    intersections.add(coord);
  }
}
console.log(intersections)

console.log(
  utils.min(
    [...intersections]
      .map(separate)
      .map((coord) => utils.sum(coord.map(Math.abs)))
  )
);
// ans: 1519

