// Figma Design System - Colors

export const Colors = {
  // Base
  white: '#FFFFFF',

  // Gray Scale
  gray50: '#F5F5F7',
  gray100: '#E6E6EA',
  gray200: '#D4D4D9',
  gray300: '#C0BEC5',
  gray400: '#A3A1A9',
  gray500: '#85858B',
  gray600: '#6A6670',
  gray700: '#545059',
  gray800: '#3D3941',
  gray900: '#29252B',

  // Primary
  primary50: '#EBE0F9',
  primary100: '#E0CDF5',
  primary200: '#D0B5F0',
  primary300: '#C5A2ED',
  primary400: '#B990E9',
  primary500: '#B284E7', // main
  primary600: '#9971C6',
  primary700: '#8563AD',
  primary800: '#735596',
  primary900: '#61487F',

  // Background
  bg50: '#FCFAF5',
  bg100: '#FBF8F2',
  bg200: '#EEEBE5',
  bg300: '#E1DFD9',
  bg400: '#CDCBC6',

  // System
  error: '#DC5063',
};

// Helper function to convert RGB to hex
export const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
