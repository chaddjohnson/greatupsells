import styled from 'styled-components';
import facepaint from 'facepaint';

// Define breakpoints.
const mq = facepaint([
  '@media(min-width: 320px)',
  '@media(min-width: 768px)',
  '@media(min-width: 1024px)',
  '@media(min-width: 1440px)'
]);

// Get list of helper functions.
const keys = Object.keys(styled);

// Provide an overridden version of `styled` as a function.
const styledWithFacepaint = (key) => (...styles) => {
  return styled(key)`
    ${mq(styles)}
  `;
};

// Provide an overridden version of each helper function.
keys.forEach((key) => {
  styledWithFacepaint[key] = (...styles) => {
    return styled(key)`
      ${mq(styles)}
    `;
  };
});

export default styledWithFacepaint;
