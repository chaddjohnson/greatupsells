import React, { useContext } from 'react';
import { ComponentContext } from '../../components';

const MoneyLine = ({ label, amount, loading = false }) => {
  const { Tiles, TextBlock, TextContainer } = useContext(ComponentContext);

  return (
    <Tiles>
      <TextBlock size="small">{label}</TextBlock>
      <TextContainer alignment="trailing">
        <TextBlock emphasized size="small">
          {loading ? '-' : amount}
        </TextBlock>
      </TextContainer>
    </Tiles>
  );
};

export default MoneyLine;
