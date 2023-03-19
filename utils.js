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

export const generateRGBAColors = (valueColorScales, dataMin, dataMax) => {
  valueColorScales.sort((a, b) => a[0] - b[0]);
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
