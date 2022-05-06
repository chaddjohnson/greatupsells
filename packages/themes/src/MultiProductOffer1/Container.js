import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Container = styled.div({
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: ({ theme }) => `${theme.bodyFontSize / 16}rem`,
  color: ({ theme }) => theme.bodyTextColor,
  backgroundColor: ({ theme }) => theme.popupBackgroundColor,
  width: '600px',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: '100vh',
  margin: 'auto',
  padding: ['1rem', '1.5rem', '1.5rem', '1.5rem'],
  boxSizing: 'border-box',
  position: 'relative',
  borderRadius: '5px',
  overflowY: 'auto',

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
  backgroundClip: 'padding-box'
});

export default Container;
