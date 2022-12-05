import React, { useContext } from 'react';
import tinycolor from 'tinycolor2';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';

const CloseButton = styled(({ className }) => {
  const { handleClose } = useContext(StateContext);

  return (
    <button
      className={className}
      aria-label="Close offer"
      onClick={handleClose}
      dangerouslySetInnerHTML={{ __html: '&#x2715' }}
    />
  );
})({
  position: 'absolute',
  right: ['1.25rem', '1.75rem', '1.75rem', '1.75rem'],
  top: ['1.25rem', '1.75rem', '1.75rem', '1.75rem'],
  fontWeight: 500,
  fontSize: ['1.25rem', '1.4rem', '1.4rem', '1.4rem'],
  padding: '8.5px 0 0 0.5px',
  lineHeight: 0,
  color: ({ theme }) =>
    tinycolor(theme.bannerBackgroundColor).isLight()
      ? 'rgba(0, 0, 0, 0.4)'
      : 'rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  userSelect: 'none',
  border: 'none',
  background: 'none'
});

export default CloseButton;
