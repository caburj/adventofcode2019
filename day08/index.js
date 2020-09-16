const { read, count, min } = require('../utils');
const encodedImage = read('./day08/input.txt').trim();

const IMAGE_SIZE = [25, 6];
const [width, height] = IMAGE_SIZE;

function calculateLayers(encodedImage, width, height) {
  const nBitsPerLayer = width * height;
  const nLayers = encodedImage.length / nBitsPerLayer;
  const result = [];
  for (let i = 0; i < nLayers; i++) {
    result.push(
      [
        ...encodedImage.slice(i * nBitsPerLayer, (i + 1) * nBitsPerLayer),
      ].map((i) => parseInt(i))
    );
  }
  return result;
}

const layers = calculateLayers(encodedImage, width, height);
const minZeroLayer = min(layers, (layer) => count(layer, 0));
console.log(count(minZeroLayer, 1) * count(minZeroLayer, 2));
// logs 1848 <- Part 1 ans

function getTopVisible(layersPixels) {
  for (const pixel of layersPixels) {
    if (pixel === 2) {
      continue;
    } else {
      return pixel;
    }
  }
}

function decode(layers, width, height) {
  const nBitsPerLayer = width * height;
  const pixels = [];
  for (let i = 0; i < nBitsPerLayer; i++) {
    pixels.push(getTopVisible(layers.map((layer) => layer[i])));
  }
  const picture = [];
  for (let i = 0; i < height; i++) {
    picture[i] = [...pixels.slice(i * width, (i + 1) * width)];
  }
  let pictureStr = '';
  for (const line of picture) {
    pictureStr +=
      line.map((pixel) => (pixel == 1 ? '**' : '  ')).join('') + '\n';
  }
  return pictureStr;
}

console.log(decode(layers, 25, 6));
// logs
// ********    ****        ****  **    **  ********
// **        **    **        **  **    **        **
// ******    **              **  **    **      **
// **        **  ****        **  **    **    **
// **        **    **  **    **  **    **  **
// **          ******    ****      ****    ********
// <- Part 2 ans
