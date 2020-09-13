const { getIntCode, divmod, permute } = require('../utils');

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

function takeInput(code, args, input) {
  code[args[0]] = input.val;
  input.val = null;
}

function output(code, args, modes) {
  const [a] = parseArgs(code, args, modes);
  return a;
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
  const [quoC, op] = divmod(instruction, 100);
  const [quoB, C] = divmod(quoC, 10);
  const [quoA, B] = divmod(quoB, 10);
  const [_, A] = divmod(quoA, 10);
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

function execute(code, op, args, modes, input) {
  switch (op) {
    case 1:
      return [add(code, args, modes)];
    case 2:
      return [mul(code, args, modes)];
    case 3:
      return [takeInput(code, args, input)];
    case 4:
      return [undefined, output(code, args, modes)];
    case 5:
      return [jumpIfTrue(code, args, modes)];
    case 6:
      return [jumpIfFalse(code, args, modes)];
    case 7:
      return [lessThan(code, args, modes)];
    case 8:
      return [equals(code, args, modes)];
  }
}

class Program {
  constructor(code) {
    this.code = [...code];
    this.current = 0;
    this.connectedProgram = null;
    this.output = null;
  }
  /**
   * Runs the program until it asks for input,
   * returns an output, has terminated.
   * @returns {{ endOp: 3 | 4 | 99, payload: any }}
   */
  proceed(input = { val: null }) {
    let [op, ...modes] = parse(this.code[this.current]);
    while (true) {
      if (op === 99) {
        return { endOp: 99 };
      }
      if (op === 3 && input.val === null) {
        return { endOp: 3 };
      }
      const [nargs, args] = getArgs(this.code, op, this.current);
      const [jumpTo, output] = execute(this.code, op, args, modes, input);
      if (jumpTo) {
        this.current = jumpTo;
      } else {
        this.current += nargs + 1;
      }
      if (output) {
        this.output = output;
        return { endOp: 4, payload: output };
      }
      [op, ...modes] = parse(this.code[this.current]);
    }
  }
  connectTo(otherProgram) {
    this.connectedProgram = otherProgram;
  }
  run(input = { val: null }) {
    const result = this.proceed(input);
    const { endOp, payload } = result;
    if (endOp === 4 && this.connectedProgram) {
      return this.connectedProgram.run({ val: payload });
    }
    return result;
  }
}

function noFeedbackCircuit(code, phaseSetting) {
  const [a, b, c, d, e] = phaseSetting;

  const amp1 = new Program(code);
  const amp2 = new Program(code);
  const amp3 = new Program(code);
  const amp4 = new Program(code);
  const amp5 = new Program(code);

  amp1.connectTo(amp2);
  amp2.connectTo(amp3);
  amp3.connectTo(amp4);
  amp4.connectTo(amp5);

  // apply the phase setting
  amp1.proceed({ val: a });
  amp2.proceed({ val: b });
  amp3.proceed({ val: c });
  amp4.proceed({ val: d });
  amp5.proceed({ val: e });

  // we start running with amp1
  amp1.run({ val: 0 });
  // we get the output at amp5
  return amp5.output;
}

function feedbackCircuit(code, phaseSetting) {
  const [a, b, c, d, e] = phaseSetting;

  const amp1 = new Program(code);
  const amp2 = new Program(code);
  const amp3 = new Program(code);
  const amp4 = new Program(code);
  const amp5 = new Program(code);

  amp1.connectTo(amp2);
  amp2.connectTo(amp3);
  amp3.connectTo(amp4);
  amp4.connectTo(amp5);
  // This is the only difference from noFeedbackCircuit,
  // amp5 is connected to amp1.
  amp5.connectTo(amp1);

  // apply the phase setting
  amp1.proceed({ val: a });
  amp2.proceed({ val: b });
  amp3.proceed({ val: c });
  amp4.proceed({ val: d });
  amp5.proceed({ val: e });

  // we start running with amp1
  amp1.run({ val: 0 });
  // we get the output at amp5
  return amp5.output;
}

function findMax(code, circuit, phaseSettingOptions) {
  let currentMax = 0;
  let settingMax = null;
  for (const setting of permute(phaseSettingOptions)) {
    const result = circuit(code, setting);
    if (result > currentMax) {
      currentMax = result;
      settingMax = setting;
    }
  }
  return [settingMax, currentMax];
}

const sampleCode = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'
  .split(',')
  .map((val) => parseInt(val));

const sampleCode2 = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'
  .split(',')
  .map((val) => parseInt(val));

const sampleCode3 = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'
  .split(',')
  .map((val) => parseInt(val));

const sampleCode4 = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'
  .split(',')
  .map((val) => parseInt(val));

const sampleCode5 = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'
  .split(',')
  .map((val) => parseInt(val));

const intCode = getIntCode('./day07/input.txt');

console.log(findMax(sampleCode, noFeedbackCircuit, [0, 1, 2, 3, 4]));
// [ [ 4, 3, 2, 1, 0 ], 43210 ]
console.log(findMax(sampleCode2, noFeedbackCircuit, [0, 1, 2, 3, 4]));
// [ [ 0, 1, 2, 3, 4 ], 54321 ]
console.log(findMax(sampleCode3, noFeedbackCircuit, [0, 1, 2, 3, 4]));
// [ [ 1, 0, 4, 3, 2 ], 65210 ]
console.log(findMax(intCode, noFeedbackCircuit, [0, 1, 2, 3, 4]));
// [ [ 1, 0, 3, 4, 2 ], 21760 ]     <- Part 1 Answer

console.log(findMax(sampleCode4, feedbackCircuit, [5, 6, 7, 8, 9]));
// [ [ 9, 8, 7, 6, 5 ], 139629729 ]
console.log(findMax(sampleCode5, feedbackCircuit, [5, 6, 7, 8, 9]));
// [ [ 9, 7, 8, 5, 6 ], 18216 ]
console.log(findMax(intCode, feedbackCircuit, [5, 6, 7, 8, 9]));
// [ [ 8, 9, 5, 6, 7 ], 69816958 ]  <- Part 2 Answer
