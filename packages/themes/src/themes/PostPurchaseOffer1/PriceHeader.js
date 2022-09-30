import React, { useContext } from 'react';
import { ComponentContext } from '../../components';

const PriceHeader = ({ originalPrice, discountedPrice, loading }) => {
  const { TextContainer, Text } = useContext(ComponentContext);

  return (
    <TextContainer alignment="leading" spacing="loose">
      {originalPrice && (
        <Text role="deletion" size="large">
          {!loading && originalPrice}
        </Text>
      )}
      <Text emphasized size="large">
        {' '}
        {!loading && discountedPrice}
      </Text>
    </TextContainer>
  );
};

export default PriceHeader;
