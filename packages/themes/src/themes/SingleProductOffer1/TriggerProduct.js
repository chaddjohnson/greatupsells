import React, { useContext } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';

const TriggerProductImageContainer = styled.div({
  margin: '0 auto 0.5rem auto',
  textAlign: 'center',
  position: 'relative'
});

const AddedIconContainer = styled.span({
  display: 'inline-block',
  position: 'relative',

  '::after': {
    content: '"check_circle"',
    fontFamily: 'Material Icons',
    fontSize: ['1.25rem', '1.5rem', '1.5rem', '1.5rem'],
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
    color: '#008160',
    backgroundColor: 'white',
    borderRadius: '50%'
  }
});

const TriggerProductImage = styled.div({
  width: 'auto',
  height: 'auto',
  maxWidth: ['50px', '70px', '70px', '70px'],
  maxHeight: ['50px', '70px', '70px', '70px']
});

const TriggerProductTitle = styled.figcaption({
  marginTop: ['0.5rem', '1.5rem', '1.5rem', '1.5rem']
});

const TriggerProduct = styled(({ className }) => {
  const { triggerProduct } = useContext(StateContext);

  return (
    <figure className={className}>
      <TriggerProductImageContainer>
        <AddedIconContainer>
          <TriggerProductImage
            src={triggerProduct.image.src}
            alt={triggerProduct.image.alt}
          />
        </AddedIconContainer>
      </TriggerProductImageContainer>
      <TriggerProductTitle>{triggerProduct.title}</TriggerProductTitle>
    </figure>
  );
})({
  flex: 2,
  textAlign: 'center'
});

export default TriggerProduct;
