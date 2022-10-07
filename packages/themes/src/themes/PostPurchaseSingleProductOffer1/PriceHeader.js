import React, { useContext } from 'react';
import { ComponentContext, ThemeContext } from '../../components';

const PriceHeader = ({ originalPrice, discountedPrice, savings, loading }) => {
  const { TextContainer, Text } = useContext(ComponentContext);
  const { showSavings } = useContext(ThemeContext);

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
        {savings && showSavings && (
          <Text emphasized size="large" appearance="success">
            {' '}
            {!loading && `(Save ${savings}%)`}
          </Text>
        )}
      </Text>
    </TextContainer>
  );
};

export default PriceHeader;
