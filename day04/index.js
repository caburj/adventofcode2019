function isValidPass(pass) {
  let valid = true;
  let dupli = false;
  for (let i = 0; i < 5; i++) {
    const [a, b] = pass.slice(i, i + 2);
    if (a == b) dupli = true;
    if (a > b) {
      valid = false;
      break;
    }
  }
  return valid && dupli;
}

function isValidPass2(pass) {
  if (!isValidPass(pass)) return false;
  let prev = pass[0];
  let count = 1;
  let record = { [prev]: count };
  for (let next of pass.slice(1)) {
    if (next == prev) {
      count += 1;
    } else {
      count = 1;
    }
    record[next] = count;
    prev = next;
  }
  return new Set(Object.values(record)).has(2);
}

function bruteForce(a, b, validator) {
  let count = 0;
  for (let i = a; i <= b; i++) {
    if (validator(i.toString())) {
      count++;
    }
  }
  return count;
}

console.log('part1:', bruteForce(347312, 805915, isValidPass));
console.log('part2:', bruteForce(347312, 805915, isValidPass2));
