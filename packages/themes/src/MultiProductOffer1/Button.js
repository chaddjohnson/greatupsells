import React from 'react';
import clsx from 'clsx';
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
  }
});

export default Button;
