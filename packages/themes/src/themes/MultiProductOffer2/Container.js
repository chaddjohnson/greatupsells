import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Container = styled.div({
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: ({ theme }) => `${theme.bodyFontSize / 16}rem`,
  color: 'black',
  backgroundColor: ({ theme }) => theme.popupBackgroundColor,
  width: '700px',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: 'calc(100vh - 5rem)',
  overflowX: 'clip',
  overflowY: ['clip', 'auto', 'auto', 'auto'],
  margin: 'auto',
  padding: '2.15rem',
  boxSizing: 'border-box',
  position: 'relative',
  borderRadius: '26px',

  /* Reference: https://gist.github.com/hsleonis/55712b0eafc9b25f1944 */
  WebkitTextSizeAdjust: '100%',
  fontVariantLigatures: 'none',
  WebkitFontVariantLigatures: 'none',
  textRendering: 'optimizeLegibility',
  MozOsxFontSmoothing: 'grayscale',
  fontSmoothing: 'antialiased',
  WebkitFontSmoothing: 'antialiased',
  textShadow: 'rgba(0, 0, 0, .01) 0 0 1px',

  /* Reference: https://gist.github.com/chemicaloliver/1234670 */
  WebkitBackgroundClip: 'padding-box',
  MozBackgroundClip: 'padding-box',
  backgroundClip: 'padding-box',

  '@media (max-width: 1023px) and (orientation: landscape)': {
    maxHeight: 'calc(100vh - 1.5rem)'
  }
});

export default Container;
