import styled from 'styled-components';

const ModalContentContainer = styled.div`
  max-width: ${(props) =>
    props.forceDisplayType === 'mobile' ? '375px' : '100%'};
  max-height: 100%;
  margin: auto;
  position: relative;
  z-index: 100;
`;

export default ModalContentContainer;
