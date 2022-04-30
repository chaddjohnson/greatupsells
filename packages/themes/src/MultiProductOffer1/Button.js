import React from 'react';
import clsx from 'clsx';
import styled from '@greatupsells/styled-with-facepaint';

// Source: https://stackoverflow.com/a/51567564/83897
const colorIsLight = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
};

const Button = styled(
  ({ className, type = 'button', loading = false, children, ...props }) => (
    <button
      className={clsx(className, loading && 'loading')}
      type={type}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
)({
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: ({ theme }) => `${theme.buttonsFontSize}px`,
  fontWeight: 600,
  color: ({ theme }) => theme.buttonTextColor,
  backgroundColor: ({ theme }) => theme.buttonBackgroundColor,
  border: 'none',
  borderRadius: '2px',
  textDecoration: 'none',
  letterSpacing: '0.5px',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: ['39px', '43px', '43px', '43px'],
  textTransform: 'uppercase',
  cursor: 'pointer',

  '&:hover:not(:disabled)': {
    color: ({ theme }) => theme.buttonHoverTextColor,
    backgroundColor: ({ theme }) => theme.buttonHoverBackgroundColor
  },
  '&:disabled': {
    backgroundColor: '#F1F1F1',
    cursor: 'default'
  },
  '& > span': {
    pointerEvents: 'none'
  },

  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  },

  // TODO Rely on React state?
  '&.loading': {
    '&::after': {
      content: '""',
      height: '16px',
      width: '16px',
      color: ({ theme }) =>
        colorIsLight(theme.buttonBackgroundColor)
          ? 'rgba(0, 0, 0, 0.75)'
          : 'rgba(255, 255, 255, 0.75)',
      position: 'absolute',
      display: 'inline-block',
      border: '3px solid',
      borderRadius: '50%',
      borderTopColor: 'transparent',
      animation: 'rotate 1s linear infinite'
    },
    '& > span': {
      visibility: 'hidden'
    }
  }
});

export default Button;
