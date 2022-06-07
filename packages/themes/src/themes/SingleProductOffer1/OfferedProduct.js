import React, { useContext } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';

const OfferedProductThumbnail = styled.img({
  width: 'auto',
  height: 'auto',
  maxWidth: ['100px', '150px', '150px', '150px'],
  maxHeight: ['100px', '150px', '150px', '150px']
});

const OfferedProductTitle = styled.figcaption({
  marginTop: ['0.5rem', '1.5rem', '1.5rem', '1.5rem'],
  marginRight: 0,
  marginBottom: ['0.5rem', '1rem', '1rem', '1rem'],
  marginLeft: 0
});

const OfferedProductPrices = styled.span({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const OfferedProductSalePrice = styled.strong({
  color: ({ theme }) => theme.salePriceTextColor,
  fontSize: '1.25rem',
  fontWeight: 600,
  marginRight: '0.25rem'
});

const OfferedProductPrice = styled.s({
  color: ({ theme }) => theme.priceTextColor,
  fontWeight: 500,
  marginLeft: '0.25rem'
});

const OfferedProduct = styled(({ className }) => {
  const { offeredProducts, selectedVariants, showOriginalPrice } = useContext(
    StateContext
  );
  const offeredProduct = offeredProducts[0];
  const selectedVariant = selectedVariants[0];

  return (
    <figure className={className}>
      <a
        href={selectedVariant.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Click to view this product in a new tab"
      >
        <OfferedProductThumbnail
          src={selectedVariant.image.src}
          alt={selectedVariant.image.alt}
        />
        <OfferedProductTitle>{offeredProduct.title}</OfferedProductTitle>
        <OfferedProductPrices>
          <OfferedProductSalePrice>
            {selectedVariant.salePriceFormatted}
          </OfferedProductSalePrice>
          {showOriginalPrice && (
            <OfferedProductPrice>
              {selectedVariant.priceFormatted}
            </OfferedProductPrice>
          )}
        </OfferedProductPrices>
      </a>
    </figure>
  );
})({
  flex: 3
});

export default OfferedProduct;
