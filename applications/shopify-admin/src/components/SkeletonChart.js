import styled from 'styled-components';
import {
  Stack,
  SkeletonDisplayText,
  SkeletonBodyText,
  SkeletonThumbnail
} from '@shopify/polaris';

const SkeletonThumbnailWrapper = styled.div`
  .Polaris-SkeletonThumbnail {
    width: 100%;
    height: 400px;
  }
`;

const SkeletonChart = () => (
  <>
    <Stack vertical>
      <SkeletonDisplayText size="small" />
      <SkeletonBodyText lines={3} />
      <SkeletonThumbnailWrapper>
        <SkeletonThumbnail />
      </SkeletonThumbnailWrapper>
    </Stack>
  </>
);

export default SkeletonChart;
