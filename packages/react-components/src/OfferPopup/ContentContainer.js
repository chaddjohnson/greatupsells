import styled from 'styled-components';

const ContentContainer = styled.div`
  max-width: ${(props) => (props.designMode && props.forceDisplayType === 'desktop' ? 'calc(100vw - 4.5rem)' : '100%')};
  max-height: 100%;
  margin: auto;
  position: relative;
  z-index: 100;
`;

export default ContentContainer;
