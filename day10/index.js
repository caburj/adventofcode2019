const { mergesort } = require('../utils');

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.repr = `${this.x},${this.y}`;
  }
  dx(other) {
    return other.x - this.x;
  }
  dy(other) {
    return other.y - this.y;
  }
  distTo(other) {
    return Math.sqrt(this.dy(other) ** 2 + this.dx(other) ** 2);
  }
  /**
   * Clockwise angle from the +vertical axis of the line form by `this`
   * and `other`.
   *
   * @param {Point} other
   */
  angle(other) {
    const quadrant = this.getQuadrant(other);
    const angle = Math.abs(Math.atan(this.dx(other) / this.dy(other)));
    switch (quadrant) {
      case 1: // 1st quadrant
        return Math.PI - angle;
      case 2: // 2nd quadrant
        return Math.PI + angle;
      case 3: // 3rd quadrant
        return 2 * Math.PI - angle;
      case 4: // 4th quadrant
        return angle;
      case 5: // +y axis
        return Math.PI;
      case 6: // -x axis
        return (3 * Math.PI) / 2;
      case 7: // -y axis
        return 0;
      case 8: // +x axis
        return Math.PI / 2;
    }
  }

  /**
   * Returns the quadrant of `other` if `this` is the origin.
   * If `other` is directly in axis, it returns 5, 6, 7 and 8 for
   * +y, -x, -y and +x, respectively.
   *
   * 3 -y 4
   * -x  +x
   * 2 +y 1
   *
   * @param {Point} other
   */
  getQuadrant(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    if (dx > 0 && dy > 0) {
      return 1;
    } else if (dx < 0 && dy > 0) {
      return 2;
    } else if (dx < 0 && dy < 0) {
      return 3;
    } else if (dx > 0 && dy < 0) {
      return 4;
    } else if (dx === 0 && dy > 0) {
      return 5; // +y
    } else if (dx < 0 && dy === 0) {
      return 6; // -x
    } else if (dx === 0 && dy < 0) {
      return 7; // -y
    } else {
      return 8; // +x
    }
  }
}

function getAsteroidCoords(asteroidMap) {
  return asteroidMap
    .trim()
    .split('\n')
    .map((line) => line.split(''))
    .map((line, y) =>
      line.map((sym, x) => (sym === '#' ? new Point(x, y) : false))
    )
    .flat()
    .filter(Boolean);
}

function bestLocation(asteroidMap) {
  const asteroids = getAsteroidCoords(asteroidMap);
  let max = 0;
  let base = null;
  for (let currentBase of asteroids) {
    const angles = new Set([]);
    for (let asteroid of asteroids) {
      if (currentBase === asteroid) continue;
      const angle = currentBase.angle(asteroid);
      angles.add(angle);
    }
    if (angles.size > max) {
      max = angles.size;
      base = currentBase;
    }
  }
  return [max, base];
}

function nthDestroyed(asteroidMap, base, nth) {
  let asteroids = getAsteroidCoords(asteroidMap);
  const map = {};
  for (let asteroid of asteroids) {
    if (base.repr === asteroid.repr) continue;
    map[asteroid.repr] = {
      dist: base.distTo(asteroid),
      angle: base.angle(asteroid),
    };
  }
  asteroids = asteroids.filter((asteroid) => Boolean(map[asteroid.repr]));
  mergesort(
    asteroids,
    (asteroid) => map[asteroid.repr].dist,
    (comparator = (a, b) => a > b)
  );
  mergesort(asteroids, (asteroid) => map[asteroid.repr].angle);
  const orderedMap = {};
  for (let asteroid of asteroids) {
    const angle = map[asteroid.repr].angle;
    if (orderedMap[angle]) {
      orderedMap[angle].push(asteroid);
    } else {
      orderedMap[angle] = [asteroid];
    }
  }
  let count = 1;
  while (true) {
    for (const angle in orderedMap) {
      const destroyedAsteroid = orderedMap[angle].pop();
      if (!destroyedAsteroid) continue;
      if (count === nth) return destroyedAsteroid;
      count += 1;
    }
  }
}

module.exports = { bestLocation, nthDestroyed, Point };
