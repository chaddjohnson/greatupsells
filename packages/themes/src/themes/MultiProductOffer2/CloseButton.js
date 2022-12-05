import React, { useContext } from 'react';
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
  right: '1.75rem',
  top: '1.75rem',
  fontWeight: 400,
  fontSize: '1.4rem',
  padding: '8.5px 0 0 0.5px',
  lineHeight: 0,
  color: 'rgba(0, 0, 0, 0.4)',
  cursor: 'pointer',
  userSelect: 'none',
  border: 'none',
  background: 'none'
});

export default CloseButton;
