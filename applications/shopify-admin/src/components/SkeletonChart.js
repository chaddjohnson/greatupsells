import styled from 'styled-components';
import { BlockStack, SkeletonDisplayText, SkeletonBodyText, SkeletonThumbnail } from '@shopify/polaris';

const SkeletonThumbnailWrapper = styled.div`
  .Polaris-SkeletonThumbnail {
    width: 100%;
    height: 400px;
  }
`;

const SkeletonChart = () => (
  <BlockStack>
    <SkeletonDisplayText size="small" />
    <SkeletonBodyText lines={2} />
    <SkeletonThumbnailWrapper>
      <SkeletonThumbnail />
    </SkeletonThumbnailWrapper>
  </BlockStack>
);

export default SkeletonChart;
