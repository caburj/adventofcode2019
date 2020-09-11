const { getIntCode, mod, getUserInput } = require('../utils');
const intCode = getIntCode('./day05/input.txt');

/// Day 5 sample input
// const intCode = '3,0,4,0,99'.split(',').map((i) => parseInt(i));

/// Day 5 part2 sample input
// const intCode = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'
//   .split(',')
//   .map((i) => parseInt(i));

// Day 2 sample input
// const intCode = '1,9,10,3,2,3,11,0,99,30,40,50'
//   .split(',')
//   .map((i) => parseInt(i));

/// Day 2 input
// const intCode = getIntCode('./day02/input.txt');
// intCode[1] = 12;
// intCode[2] = 2;

function parseArgs(code, args, modes) {
  return Array(args.length)
    .fill(0)
    .map((_, i) => (modes[i] ? args[i] : code[args[i]]));
}

function add(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  // NOTE: "Parameters that an instruction writes to will never be in immediate mode."
  code[args[2]] = a + b;
}

function mul(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  code[args[2]] = a * b;
}

async function takeInput(code, args, modes) {
  const input = parseInt(await getUserInput('enter a number: '));
  code[args[0]] = input;
}

function output(code, args, modes) {
  const [a] = parseArgs(code, args, modes);
  console.log(a);
}

function jumpIfTrue(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  if (a !== 0) {
    return b;
  }
}

function jumpIfFalse(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  if (a === 0) {
    return b;
  }
}

function lessThan(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  if (a < b) {
    code[args[2]] = 1;
  } else {
    code[args[2]] = 0;
  }
}

function equals(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  if (a === b) {
    code[args[2]] = 1;
  } else {
    code[args[2]] = 0;
  }
}

function parse(instruction) {
  const [quoC, op] = mod(instruction, 100);
  const [quoB, C] = mod(quoC, 10);
  const [quoA, B] = mod(quoB, 10);
  const [_, A] = mod(quoA, 10);
  return [op, C, B, A];
}

function getArgs(code, op, current) {
  let nargs = 0;
  let args = [];
  switch (op) {
    case 1:
      nargs = 3;
      break;
    case 2:
      nargs = 3;
      break;
    case 3:
      nargs = 1;
      break;
    case 4:
      nargs = 1;
      break;
    case 5:
      nargs = 2;
      break;
    case 6:
      nargs = 2;
      break;
    case 7:
      nargs = 3;
      break;
    case 8:
      nargs = 3;
      break;
  }
  args = [...code.slice(current + 1, current + nargs + 1)];
  return [nargs, args];
}

async function execute(code, op, args, modes) {
  switch (op) {
    case 1:
      return add(code, args, modes);
    case 2:
      return mul(code, args, modes);
    case 3:
      return await takeInput(code, args, modes);
    case 4:
      return output(code, args, modes);
    case 5:
      return jumpIfTrue(code, args, modes);
    case 6:
      return jumpIfFalse(code, args, modes);
    case 7:
      return lessThan(code, args, modes);
    case 8:
      return equals(code, args, modes);
  }
}

/**
 * Based on `run1` in day02.
 */
async function modifiedRun(code) {
  let current = 0;
  let [op, ...modes] = parse(code[current]);
  while (op !== 99) {
    const [nargs, args] = getArgs(code, op, current);
    const jumpTo = await execute(code, op, args, modes);
    if (jumpTo) {
      current = jumpTo;
    } else {
      current += nargs + 1;
    }
    [op, ...modes] = parse(code[current]);
  }
  return code;
}

(async () => await modifiedRun(intCode))();
// enter 1 as input, logs:
// 0
// 0
// 0
// 0
// 0
// 0
// 0
// 0
// 0
// 7157989 <- answer part1

// enter 5 as input, logs:
// 7873292 <- answer part2
