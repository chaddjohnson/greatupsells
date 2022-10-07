import React, { useContext } from 'react';
import { ComponentContext } from '../../components';

const MoneySummary = ({ label, amount, loading = false }) => {
  const { Tiles, TextBlock, TextContainer } = useContext(ComponentContext);

  return (
    <Tiles>
      <TextBlock size="medium" emphasized>
        {label}
      </TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="medium">
          {loading ? '-' : amount}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
};

export default MoneySummary;
