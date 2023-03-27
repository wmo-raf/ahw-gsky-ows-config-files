const scaleDataValue = (value, minValue, maxValue) => {
  return (value - minValue) / (maxValue - minValue);
};

const interpolateColors = (color1, color2, factor) => {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
  const a = Math.round(color1[3] + (color2[3] - color1[3]) * factor);
  return [r, g, b, a];
};

const rgbaToDictListJSON = (rgbaColors) => {
  const dictList = rgbaColors.map((color) => {
    return {
      r: color[0],
      g: color[1],
      b: color[2],
      a: color[3],
    };
  });

  return JSON.stringify(dictList);
};

const generateRGBAColors = (valueColorScales) => {
  valueColorScales.sort((a, b) => a[0] - b[0]);

  const dataMin = Math.min(...valueColorScales.map((val) => val[0]));
  const dataMax = Math.max(...valueColorScales.map((val) => val[0]));

  const rgbaColors = [];

  for (let i = 0; i < 256; i++) {
    const dataValue = (i / 255) * (dataMax - dataMin) + dataMin;

    for (let j = 0; j < valueColorScales.length - 1; j++) {
      if (
        valueColorScales[j][0] <= dataValue &&
        dataValue <= valueColorScales[j + 1][0]
      ) {
        const scaledValue = scaleDataValue(
          dataValue,
          valueColorScales[j][0],
          valueColorScales[j + 1][0]
        );

        const rgbaColor = interpolateColors(
          valueColorScales[j][1],
          valueColorScales[j + 1][1],
          scaledValue
        );
        rgbaColors.push(rgbaColor);
        break;
      }
    }
  }

  return rgbaToDictListJSON(rgbaColors);
};

const colorValues = [
  [0.1, [255, 255, 255, 0]],
  [0.2, [161, 237, 227, 255]],
  [0.4, [92, 227, 186, 255]],
  [0.8, [252, 215, 117, 255]],
  [1.2, [218, 114, 48, 255]],
  [1.6, [158, 98, 38, 255]],
  [3.2, [113, 73, 33, 255]],
  [6.4, [57, 37, 17, 255]],
  [7, [29, 19, 9, 255]],
];

color_values = [
  { value: 0.1, rgba: [255, 255, 255, 0] },
  { value: 0.2, rgba: [161, 237, 227, 255] },
  { value: 0.4, rgba: [92, 227, 186, 255] },
  { value: 0.8, rgba: [252, 215, 117, 255] },
  { value: 1.2, rgba: [218, 114, 48, 255] },
  { value: 1.6, rgba: [158, 98, 38, 255] },
  { value: 3.2, rgba: [113, 73, 33, 255] },
  { value: 6.4, rgba: [57, 37, 17, 255] },
  { value: 7, rgba: [29, 19, 9, 255] },
];

generateRGBAColors(colorValues);

// const offSetValue = -dataMin;
// const clipValue = dataMax + offSetValue;
// const scaleValue = 254 / (dataMax - dataMin);
