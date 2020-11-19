import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import handlebars from 'handlebars';

export const ModalContainer = styled.div`
  max-width: 100%;
  max-height: 100%;
  position: relative;
  z-index: 100;

  /* Reference: https://gist.github.com/chemicaloliver/1234670 */
  border: 1px solid rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
`;

export const Mask = styled.div`
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

const OfferPopup = ({
  appRoot,
  renderTo,
  open,
  offer,
  product,
  theme,
  themeData,
  onClose,
  onClick
}) => {
  const template = useMemo(() => handlebars.compile(theme.markup), [
    theme.markup
  ]);
  const markup = useMemo(() => template(theme.themeVariables), [
    template,
    theme.themeVariables
  ]);

  const handleSubmit = (event) => {
    if (!event) {
      throw new Error('No event object passed to form submission handler.');
    }

    // Prevent default form action.
    event.preventDefault();

    // Collect form values.
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // TODO: Create data model for tracking submissions.
    // TODO: Save submission.
  };

  const handleClose = () => {
    if (!renderTo) {
      onClose();
    }
  };

  window.OfferPopup.submit = handleSubmit;
  window.OfferPopup.close = handleClose;

  Modal.setAppElement(appRoot);

  return (
    <Modal
      closeTimeoutMS={!renderTo ? 200 : 0}
      parentSelector={() => renderTo || document.body}
      isOpen={open || !!renderTo}
      shouldFocusAfterRender={!renderTo}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      contentLabel="Offer Modal"
      onRequestClose={handleClose}
      style={{
        overlay: {
          position: renderTo ? 'relative' : 'fixed',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2147483647
        },
        content: {
          position: renderTo ? 'static' : 'absolute',
          background: 'none',
          border: 'none',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }}
    >
      <ModalContainer dangerouslySetInnerHTML={{ __html: markup }} />
      {renderTo && <Mask onClick={onClick} />}
    </Modal>
  );
};

OfferPopup.propTypes = {
  appRoot: PropTypes.string.isRequired,
  open: PropTypes.bool,
  product: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  renderTo: PropTypes.object,
  onClose: PropTypes.func,
  onClick: PropTypes.func
};

OfferPopup.defaultProps = {
  open: false
};

export default OfferPopup;
