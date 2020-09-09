const fs = require('fs');
const utils = require('../utils');
const data = fs.readFileSync('./day01/input.txt', { encoding: 'utf-8' });
const masses = data
  .trim()
  .split('\n')
  .map((val) => parseInt(val.trim()));

function fuel1(mass) {
  return ~~(mass / 3) - 2;
}
const fuels1 = masses.map(fuel1);
console.log('fuel requirement 1:', utils.sum(fuels1));

function fuel2(mass) {
  const initReq = fuel1(mass);
  if (mass <= 2 || initReq <= 0) return 0;
  return initReq + fuel2(initReq);
}
const fuels2 = masses.map(fuel2);
console.log('fuel requirement 2:', utils.sum(fuels2));

/**
 * Answer
 * fuel requirement 1: 3550236
 * fuel requirement 2: 5322455
 */
