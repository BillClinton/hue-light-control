import cieRgbColorConverter from 'cie-rgb-color-converter';
// import cieRgbColorConverter from 'https://cdn.skypack.dev/cie-rgb-color-converter';

export function convertXYToRGB(x, y, bri) {
  const rgb = cieRgbColorConverter.xyBriToRgb(x, y, bri);

  const r = Math.min(Math.max(rgb.r, 0), 255).toString(16).padStart(2, '0');
  const g = Math.min(Math.max(rgb.g, 0), 255).toString(16).padStart(2, '0');
  const b = Math.min(Math.max(rgb.b, 0), 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function convertRGBToXY(color, modelID) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  const xy = cieRgbColorConverter.rgbToXy(r, g, b, modelID);
  return [Number(xy.x.toFixed(4)), Number(xy.y.toFixed(4))];
}

export function convertRGBToHex(rgb) {
  return `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function approximateBrightness(color) {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  //   return Math.floor((r + g + b) / 10);
  //   return Math.max(r, g, b);
  return Math.round((0.21 * r + 0.72 * g + 0.07 * b) / 2); // perceptive luminance?
}
