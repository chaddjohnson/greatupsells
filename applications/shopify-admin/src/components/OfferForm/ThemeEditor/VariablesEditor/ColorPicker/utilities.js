import Colr from 'colr';

export const valueIsHex = (value) => {
  return !!value && !!value.match(/^#(?=[a-fA-F0-9]+$)(?:.{3}|.{6})$/);
};

export const valueIsRgb = (value) => {
  return !!value && !!value.match(/^rgba?\([\d*.?\d*, ]+\)$/);
};

// Reference: https://stackoverflow.com/a/5624139/83897
const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b) // eslint-disable-line no-bitwise
    .toString(16)
    .slice(1)}`.toUpperCase();
};

// Reference: https://stackoverflow.com/a/5624139/83897
export const hexToRgb = (hexValue, alphaValue = undefined) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hexValue = hexValue.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
  const r = result?.[1] && parseInt(result[1], 16);
  const g = result?.[2] && parseInt(result[2], 16);
  const b = result?.[3] && parseInt(result[3], 16);

  if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
    if (typeof alphaValue === 'number') {
      return `rgba(${r}, ${g}, ${b}, ${alphaValue.toFixed(2)})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  return hexValue;
};

// Returns value as hex.
export const normalize = (value) => {
  const isRgb = valueIsRgb(value);
  const { 0: r, 1: g, 2: b, 3: a } =
    isRgb &&
    value
      .replace(/[^\d*.?\d*,]/g, '')
      .split(',')
      .map((color) => parseFloat(color));

  if (isRgb) {
    return [
      rgbToHex(r, g, b),
      typeof a === 'number' ? parseFloat(a) : undefined
    ];
  }

  return [value || '#000000'];
};

export const hexToHsb = (hex, alphaValue = undefined) => {
  if (!hex) {
    return hex;
  }

  const hsv = Colr().fromHex(hex).toHsvObject();

  return {
    hue: hsv.h > 0 ? Math.round(hsv.h) : hsv.h,
    saturation: hsv.s > 0 ? hsv.s / 100 : hsv.s,
    brightness: hsv.v > 0 ? hsv.v / 100 : hsv.v,
    alpha: alphaValue
  };
};

export const hsbToHex = (hsb) => {
  if (!hsb) {
    return hsb;
  }

  return Colr()
    .fromHsvObject({
      h: hsb.hue,
      s: hsb.saturation * 100,
      v: hsb.brightness * 100
    })
    .toHex()
    .toUpperCase();
};

export const sanitizeHexValue = (hexValue) => {
  const sanitizedHexValue = (hexValue || '')
    .toString()
    .trim()
    .replace(/[^a-fA-F0-9]/g, '');

  return sanitizedHexValue ? `#${sanitizedHexValue}` : sanitizedHexValue;
};
