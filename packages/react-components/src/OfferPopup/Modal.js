import ReactModal from 'react-modal';
import styled from 'styled-components';

const Modal = styled(ReactModal)`
  position: ${(props) => (props.designMode ? 'static' : 'fixed')};
  background: none;
  border: none;
  margin-right: 0;
  outline: none;

  @media screen and (min-width: 320px) {
    left: 0;
    right: 0;
    top: 15%;
    bottom: 0;
    padding: 14px;
    margin-right: 0;
    transform: none;
  }

  @media screen and (min-width: 1024px) {
    left: 50%;
    right: auto;
    top: 30%;
    bottom: auto;
    padding: ${(props) => (props.designMode ? '14px' : 0)};
    transform: initial;
    margin-right: ${(props) => (props.designMode ? 0 : '-50%')};
    transform: ${(props) =>
      props.designMode ? 'none' : 'translate(-50%, -25%)'};
  }
`;

export default Modal;
