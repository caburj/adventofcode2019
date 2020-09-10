const fs = require('fs');
const utils = require('../utils');
const data = fs.readFileSync('./day03/input.txt', { encoding: 'utf-8' });
const [firstWireStr, secondWireStr] = data.trim().split('\n');
const firstWire = firstWireStr.trim().split(',');
const secondWire = secondWireStr.trim().split(',');

// sample
// const utils = require('../utils');
// const firstWire = 'R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(',');
// const secondWire = 'U62,R66,U55,R34,D71,R55,D58,R83'.split(',');

// sample
// const utils = require('../utils');
// const firstWire = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(',');
// const secondWire = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(',');

function combine(x, y) {
  return `${x}/${y}`;
}

function separate(str) {
  return str.split('/').map((comp) => parseInt(comp));
}

function getCoordSet(wire) {
  const dist = {};
  const set = new Set([]);
  let x = 0;
  let y = 0;
  let len = 0;
  for (const xxx of wire) {
    const dir = xxx[0];
    const length = parseInt(xxx.slice(1));
    switch (dir) {
      case 'R':
        for (let i = 0; i < length; i++) {
          x += 1;
          const key = combine(x, y);
          len += 1;
          set.add(key);
          dist[key] = len;
        }
        break;
      case 'L':
        for (let i = 0; i < length; i++) {
          x -= 1;
          const key = combine(x, y);
          len += 1;
          set.add(key);
          dist[key] = len;
        }
        break;
      case 'U':
        for (let i = 0; i < length; i++) {
          y += 1;
          const key = combine(x, y);
          len += 1;
          set.add(key);
          dist[key] = len;
        }
        break;
      case 'D':
        for (let i = 0; i < length; i++) {
          y -= 1;
          const key = combine(x, y);
          len += 1;
          set.add(key);
          dist[key] = len;
        }
        break;
    }
  }
  return [set, dist];
}

const [firstWireCoords, firstDist] = getCoordSet(firstWire);
const [secondWireCoords, secondDist] = getCoordSet(secondWire);

const distances = new Set([]);

for (let coord of secondWireCoords) {
  if (firstWireCoords.has(coord)) {
    distances.add(firstDist[coord] + secondDist[coord]);
  }
}

console.log(distances);
console.log(utils.min([...distances]));
