const { read } = require('../utils');
const { Queue } = require('../queue');
const orbitals = read('./day06/input.txt')
  .split('\n')
  .map((line) => line.split(')'));

/// sample data
// const orbitals = `COM)B\n
// B)C\n
// C)D\n
// D)E\n
// E)F\n
// B)G\n
// G)H\n
// D)I\n
// E)J\n
// J)K\n
// K)L\n
// K)YOU\n
// I)SAN`
//   .split('\n')
//   .map((line) => line.split(')'));

class Node {
  constructor(value) {
    this._parent = null;
    this._value = value;
    this._children = [];
    this._meta = {};
  }
  get value() {
    return this._value;
  }
  set parent(node) {
    this._parent = node;
  }
  get parent() {
    return this._parent;
  }
  get children() {
    return this._children;
  }
  addChild(node) {
    node.parent = this;
    this.children.push(node);
  }
  set height(value) {
    this._meta['height'] = value;
  }
  get height() {
    return this._meta['height'] || 0;
  }
  // Only available if calculateAncestors is called.
  get ancestors() {
    return this._meta['ancestors'] || new Set([]);
  }
  // lazily calculate ancestors
  calculateAncestors() {
    const list = [];
    let current = this;
    while (current.parent) {
      list.push(current.parent.value);
      current = current.parent;
    }
    this._meta['ancestors'] = new Set(list);
  }
}

function setHeights(rootNode) {
  const queue = new Queue();
  queue.enqueue([rootNode, 0]);
  while (queue.length) {
    let [currentNode, currentHeight] = queue.dequeue();
    currentNode.height = currentHeight;
    for (const child of currentNode.children) {
      queue.enqueue([child, currentHeight + 1]);
    }
  }
}

function createOrbitalTree(orbitals, root) {
  const nodeStore = {};
  let rootNode;
  for (const [center, orbitter] of orbitals) {
    if (!nodeStore[center]) {
      nodeStore[center] = new Node(center);
    }
    if (!nodeStore[orbitter]) {
      nodeStore[orbitter] = new Node(orbitter);
    }
    const centerNode = nodeStore[center];
    const orbitterNode = nodeStore[orbitter];
    centerNode.addChild(orbitterNode);
    if (root == center) {
      rootNode = centerNode;
    }
  }
  setHeights(rootNode);
  return [rootNode, nodeStore];
}

function checkSum(rootNode) {
  let sum = 0;
  const stack = [...rootNode.children];
  while (stack.length) {
    const currentNode = stack.pop();
    sum += currentNode.height;
    stack.push(...currentNode.children);
  }
  return sum;
}

const [orbitalTree, nodeStore] = createOrbitalTree(orbitals, 'COM');
console.log('part1:', checkSum(orbitalTree));

const you = nodeStore['YOU'];
const san = nodeStore['SAN'];
you.calculateAncestors();
san.calculateAncestors();


// We look for the nearest common anscestor to YOU and SAN.
// It's actually the common anscestor farthest from the COM.
let nearestCommonAncestor = null;
let currentMaxHeight = 0;
for (let an of you.ancestors) {
  if (san.ancestors.has(an)) {
    const anNode = nodeStore[an];
    if (currentMaxHeight < anNode.height) {
      currentMaxHeight = anNode.height;
      nearestCommonAncestor = an;
    }
  }
}

const common = nodeStore[nearestCommonAncestor];
console.log(
  'part2:',
  you.parent.height + san.parent.height - common.height * 2
);
