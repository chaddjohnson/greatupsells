import React, { useContext } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import StateContext from '../StateContext';

const CloseButton = styled(({ className }) => {
  const { handleClose } = useContext(StateContext);

  return (
    <button
      className={className}
      aria-label="Close offer modal"
      onClick={handleClose}
      dangerouslySetInnerHTML={{ __html: '&#x2715' }}
    />
  );
})({
  position: 'absolute',
  right: '0.25rem',
  top: ['1rem', '0.5rem', '0.5rem', '0.5rem'],
  fontWeight: 500,
  fontSize: '1rem',
  lineHeight: 1,
  color: '#3D4246',
  cursor: 'pointer',
  userSelect: 'none',
  border: 'none',
  background: 'none'
});

export default CloseButton;
