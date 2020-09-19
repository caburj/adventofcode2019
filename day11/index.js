const { getIntCode, divmod } = require('../utils');

function parse(instruction) {
  const [quoC, op] = divmod(instruction, 100);
  const [quoB, C] = divmod(quoC, 10);
  const [quoA, B] = divmod(quoB, 10);
  const [_, A] = divmod(quoA, 10);
  return [op, C, B, A];
}

class Program {
  constructor(intCode, outputCallback) {
    this.code = [...intCode];
    this.current = 0;
    this.outputCallback = outputCallback;
    this.relativeBase = 0;
  }
  parseArgs(args, modes) {
    return Array(args.length)
      .fill(0)
      .map((_, i) => {
        switch (modes[i]) {
          case 0:
            return this.code[args[i]] || 0;
          case 1:
            return args[i];
          case 2:
            return this.code[args[i] + this.relativeBase] || 0;
        }
      });
  }
  add(args, modes) {
    const [a, b] = this.parseArgs(args, modes);
    const pos = modes[2] === 2 ? args[2] + this.relativeBase : args[2];
    this.code[pos] = a + b;
  }
  mul(args, modes) {
    const [a, b] = this.parseArgs(args, modes);
    const pos = modes[2] === 2 ? args[2] + this.relativeBase : args[2];
    this.code[pos] = a * b;
  }
  takeInput(args, modes, input) {
    const [mode] = modes;
    let [arg] = args;
    if (mode === 2) {
      arg += this.relativeBase;
    }
    this.code[arg] = input.val;
    input.val = null;
  }
  output(args, modes) {
    const [a] = this.parseArgs(args, modes);
    return a;
  }
  jumpIfTrue(args, modes) {
    const [a, b] = this.parseArgs(args, modes);
    if (a !== 0) {
      return b;
    }
  }
  jumpIfFalse(args, modes) {
    const [a, b] = this.parseArgs(args, modes);
    if (a === 0) {
      return b;
    }
  }
  lessThan(args, modes) {
    const [a, b] = this.parseArgs(args, modes);
    const pos = modes[2] === 2 ? args[2] + this.relativeBase : args[2];
    if (a < b) {
      this.code[pos] = 1;
    } else {
      this.code[pos] = 0;
    }
  }
  equals(args, modes) {
    const [a, b] = this.parseArgs(args, modes);
    const pos = modes[2] === 2 ? args[2] + this.relativeBase : args[2];
    if (a === b) {
      this.code[pos] = 1;
    } else {
      this.code[pos] = 0;
    }
  }
  adjustRelative(args, modes) {
    const [a] = this.parseArgs(args, modes);
    this.relativeBase += a;
  }
  getArgs(op, current) {
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
    args = [...this.code.slice(current + 1, current + nargs + 1)];
    return [nargs, args];
  }
  execute(op, args, modes, input) {
    switch (op) {
      case 1:
        return [this.add(args, modes)];
      case 2:
        return [this.mul(args, modes)];
      case 3:
        return [this.takeInput(args, modes, input)];
      case 4:
        return [undefined, this.output(args, modes)];
      case 5:
        return [this.jumpIfTrue(args, modes)];
      case 6:
        return [this.jumpIfFalse(args, modes)];
      case 7:
        return [this.lessThan(args, modes)];
      case 8:
        return [this.equals(args, modes)];
      case 9:
        return [this.adjustRelative(args, modes)];
    }
  }
  /**
   * Runs the program until it asks for input,
   * returns an output or has terminated.
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
      const [nargs, args] = this.getArgs(op, this.current);
      const [jumpTo, output] = this.execute(op, args, modes, input);
      if (jumpTo !== undefined) {
        this.current = jumpTo;
      } else {
        this.current += nargs + 1;
      }
      if (output !== undefined) {
        if (this.outputCallback) {
          this.outputCallback(output);
        }
        return { endOp: 4, payload: output };
      }
      [op, ...modes] = parse(this.code[this.current]);
    }
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get repr() {
    return `${this.x},${this.y}`;
  }
  /**
   * @param {Direction} direction
   */
  move(direction) {
    switch (direction.val) {
      case 'up':
        this.y += 1;
        break;
      case 'down':
        this.y -= 1;
        break;
      case 'right':
        this.x += 1;
        break;
      case 'left':
        this.x -= 1;
        break;
    }
  }
}

class Direction {
  /**
   * @param {'up' | 'right' | 'down' | 'left'} val
   */
  constructor(val) {
    this.val = val;
  }
  turnLeft() {
    switch (this.val) {
      case 'up':
        this.val = 'left';
        break;
      case 'left':
        this.val = 'down';
        break;
      case 'down':
        this.val = 'right';
        break;
      case 'right':
        this.val = 'up';
        break;
    }
  }
  turnRight() {
    switch (this.val) {
      case 'up':
        this.val = 'right';
        break;
      case 'right':
        this.val = 'down';
        break;
      case 'down':
        this.val = 'left';
        break;
      case 'left':
        this.val = 'up';
        break;
    }
  }
}

/**
 * Robot:
 * - get color of panel and send as input to program
 *    - black: 0, white: 1
 * - program runs then outputs 2 values consecutively
 *    1. color to paint the current panel. black: 0, white: 1
 *    2. direction of turn. turn left: 0, turn right: 1
 *    - robot moves one step to its direction.
 */
class Robot {
  static defaultPanel = 0;
  constructor(intCode, startingGrid = { '0,0': 0 }) {
    this.program = new Program([...intCode]);
    this.position = new Point(0, 0);
    this.direction = new Direction('up');
    this.grid = { ...startingGrid };
  }
  get currentPanel() {
    return this.panelAt(this.position);
  }
  paintCurrentPanel(paint) {
    this.grid[this.position.repr] = paint;
  }
  panelAt(point) {
    return this.grid[point.repr] || Robot.defaultPanel;
  }
  run() {
    let result = this.program.proceed({ val: this.currentPanel });
    let output = [];
    while (true) {
      if (result.endOp === 99) break;
      if (result.endOp === 4) {
        output.push(result.payload);
        if (output.length === 2) {
          const [paint, turn] = output;
          this.paintCurrentPanel(paint);
          if (turn === 0) {
            this.direction.turnLeft();
          } else {
            this.direction.turnRight();
          }
          this.position.move(this.direction);
          output = [];
        }
        result = this.program.proceed();
      } else if (result.endOp === 3) {
        result = this.program.proceed({ val: this.currentPanel });
      } else {
        result = this.program.proceed();
      }
    }
  }
}

const intCode = getIntCode('./day11/input.txt');
const robot1 = new Robot(intCode, { '0,0': 0 });
robot1.run();
console.log('part 1:', [...Object.keys(robot1.grid)].length);

const robot2 = new Robot(intCode, { '0,0': 1 });
robot2.run();
let result = '';
for (let j = 5; j > -10; j--) {
  const lineArr = [];
  for (let i = -10; i < 50; i++) {
    const point = new Point(i, j);
    lineArr.push(robot2.panelAt(point) ? '*' : ' ');
  }
  result += lineArr.join('') + '\n';
}
console.log('part 2:', result);
