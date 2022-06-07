import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Select = styled.select({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem',
  borderRadius: '2px',
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: '0.875rem',
  width: '150px',
  height: '34px',
  color: ({ theme }) => theme.inputTextColor,
  background: ({ theme }) =>
    `${theme.inputBackgroundColor} url('data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=') no-repeat right 2px center`,
  marginBottom: ['0.5rem', 0, 0, 0],
  marginTop: ({ theme }) => (theme.showPrices ? '0.75rem' : 0),
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none'
});

export default Select;
