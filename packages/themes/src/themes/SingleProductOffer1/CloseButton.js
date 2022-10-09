import React, { useContext } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';

const Inner = styled.span({
  position: 'absolute',
  top: '-2px'
});

const CloseButton = styled(({ className }) => {
  const { handleClose } = useContext(StateContext);

  return (
    <button
      className={className}
      aria-label="Close offer"
      onClick={handleClose}
    >
      <Inner dangerouslySetInnerHTML={{ __html: '&times;' }} />
    </button>
  );
})({
  position: 'absolute',
  zIndex: 1,
  right: '-10px',
  top: '-10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  fontWeight: 'bold',
  fontFamily: 'Garamond, "Apple Garamond"',
  fontSize: '1.3125rem',
  lineHeight: 1,
  color: 'white',
  backgroundColor: 'black',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  userSelect: 'none',
  border: '3px solid white',
  borderRadius: '50%',
  boxShadow: '0 2px 2px #888888'
});

export default CloseButton;
