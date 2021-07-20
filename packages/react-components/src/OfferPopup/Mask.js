import styled from 'styled-components';

// This is an invisible layer that shows over the popup in design mode to prevent direct interactions.
const Mask = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 101;
  cursor: ${(props) => (props.onClick ? 'zoom-in' : 'auto')};
`;

export default Mask;
