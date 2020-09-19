const { read } = require('../utils');
const { nthDestroyed, Point } = require('./index');

const sampleInput = `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`;

console.log(nthDestroyed(sampleInput, new Point(11, 13), 1));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 2));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 3));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 10));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 20));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 50));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 100));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 199));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 200));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 201));
console.log(nthDestroyed(sampleInput, new Point(11, 13), 299));

const input = read('./day10/input.txt');
const destroyed = nthDestroyed(input, new Point(11, 11), 200);
console.log(100 * destroyed.x + destroyed.y);
