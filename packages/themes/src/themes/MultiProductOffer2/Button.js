import React from 'react';
import clsx from 'clsx';
import tinycolor from 'tinycolor2';
import styled from '@greatupsells/styled-with-facepaint';

const Button = styled(
  ({
    className,
    type = 'button',
    loading = false,
    disabled = false,
    children,
    ...props
  }) => (
    <button
      className={clsx(className, loading && 'loading')}
      type={type}
      disabled={loading || disabled}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
)({
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: ({ theme }) => `${theme.buttonsFontSize / 16}rem`,
  fontWeight: 700,
  color: ({ theme }) => theme.buttonTextColor,
  backgroundColor: ({ theme }) => theme.buttonBackgroundColor,
  border: 'none',
  borderRadius: '4.375px',
  textDecoration: 'none',
  letterSpacing: '0.5px',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '43.75px',
  cursor: 'pointer',

  '&:hover:not(:disabled)': {
    backgroundColor: ({ theme }) =>
      tinycolor(theme.buttonBackgroundColor).darken(10)
  },
  '&:disabled': {
    backgroundColor: ({ theme }) =>
      tinycolor(theme.popupBackgroundColor).isLight()
        ? tinycolor(theme.popupBackgroundColor).darken(10)
        : tinycolor(theme.popupBackgroundColor).lighten(10),
    cursor: 'default'
  },
  '& > span': {
    pointerEvents: 'none'
  },
  '&.loading': {
    '&::after': {
      content: '""',
      height: '16px',
      width: '16px',
      color: 'rgba(140, 145, 150, 0.65)',
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
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
});

export default Button;
