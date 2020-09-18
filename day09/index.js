const { getIntCode, divmod, parseIntCode } = require('../utils');

let RELATIVE_BASE = 0;

function parseArgs(code, args, modes) {
  return Array(args.length)
    .fill(0)
    .map((_, i) => {
      switch (modes[i]) {
        case 0:
          return code[args[i]] || 0;
        case 1:
          return args[i];
        case 2:
          return code[args[i] + RELATIVE_BASE] || 0;
      }
    });
}

function add(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  const pos = modes[2] === 2 ? args[2] + RELATIVE_BASE : args[2];
  code[pos] = a + b;
}

function mul(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  const pos = modes[2] === 2 ? args[2] + RELATIVE_BASE : args[2];
  code[pos] = a * b;
}

function takeInput(code, args, modes, input) {
  const [mode] = modes;
  let [arg] = args;
  if (mode === 2) {
    arg += RELATIVE_BASE;
  }
  code[arg] = input.val;
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
  const pos = modes[2] === 2 ? args[2] + RELATIVE_BASE : args[2];
  if (a < b) {
    code[pos] = 1;
  } else {
    code[pos] = 0;
  }
}

function equals(code, args, modes) {
  const [a, b] = parseArgs(code, args, modes);
  const pos = modes[2] === 2 ? args[2] + RELATIVE_BASE : args[2];
  if (a === b) {
    code[pos] = 1;
  } else {
    code[pos] = 0;
  }
}

function adjustRelative(code, args, modes) {
  const [a] = parseArgs(code, args, modes);
  RELATIVE_BASE += a;
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
    case 2:
    case 7:
    case 8:
      nargs = 3;
      break;
    case 3:
    case 4:
    case 9:
      nargs = 1;
      break;
    case 5:
    case 6:
      nargs = 2;
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
      return [takeInput(code, args, modes, input)];
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
    case 9:
      return [adjustRelative(code, args, modes)];
  }
}

class Program {
  constructor(code, outputCallback = (output) => console.log(output)) {
    this.code = [...code];
    this.current = 0;
    this.outputCallback = outputCallback;
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
      if (jumpTo !== undefined) {
        this.current = jumpTo;
      } else {
        this.current += nargs + 1;
      }
      if (output !== undefined) {
        this.outputCallback(output);
        return { endOp: 4, payload: output };
      }
      [op, ...modes] = parse(this.code[this.current]);
    }
  }
  run(pauseAt = [3]) {
    result = challengeProgram.proceed();
    while (result.endOp !== 99) {
      if (result.endOp === 3) {
        result = challengeProgram.proceed({ val: 2 });
      } else {
        result = challengeProgram.proceed();
      }
    }
  }
}

// const sampleCode = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
// const writeItself = new Program(parseIntCode(sampleCode));
// let result = writeItself.proceed();
// while (result.endOp !== 99) {
//   result = writeItself.proceed();
// }

// RELATIVE_BASE = 0;
// const sampleCode2 = '1102,34915192,34915192,7,4,7,99,0';
// const output16digit = new Program(parseIntCode(sampleCode2));
// result = output16digit.proceed();
// while (result.endOp !== 99) {
//   result = output16digit.proceed();
// }

// RELATIVE_BASE = 0;
// const sampleCode3 = parseIntCode('104,1125899906842624,99');
// const program = new Program(sampleCode3);
// result = program.proceed();
// while (result.endOp !== 99) {
//   result = program.proceed();
// }

RELATIVE_BASE = 0;
const intCode = getIntCode('./day09/input.txt');
const challengeProgram = new Program(intCode);

