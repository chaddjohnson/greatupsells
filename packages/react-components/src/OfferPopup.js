import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { useLiquid } from 'react-liquid';

const Modal = styled(ReactModal)`
  position: ${(props) => (props.renderTo ? 'static' : 'fixed')};
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
    padding: ${(props) => (props.renderTo ? '14px' : 0)};
    transform: initial;
    margin-right: ${(props) => (props.renderTo ? 0 : '-50%')};
    transform: ${(props) =>
      props.renderTo ? 'none' : 'translate(-50%, -25%)'};
  }
`;

const ModalContentContainer = styled.div`
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  position: relative;
  z-index: 100;
`;

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

const OfferPopup = ({
  appRoot,
  renderTo,
  open,
  previewMode,
  offer,
  product,
  onClose,
  onClick
}) => {
  const { popupTheme } = offer;

  const handleSubmit = (event) => {
    if (!event) {
      throw new Error('No event object passed to form submission handler');
    }

    event.preventDefault();

    if (previewMode) {
      return;
    }

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

  // Set up template variables.
  const mappedVariables = useMemo(
    () =>
      popupTheme.variables.reduce((map, { name, value }) => ({
        ...map,
        [name]: value
      })),
    [popupTheme.variables]
  );

  // Generate the markup.
  const { markup } = useLiquid(popupTheme.template, {
    ...mappedVariables,
    product,
    submitHandler: 'window.OfferPopup.submit(event)',
    closeHandler: 'window.OfferPopup.close()'
  });

  const maskBackgroundColor = useMemo(
    () => mappedVariables.maskBackgroundColor || 'rgba(0, 0, 0, 0.5)',
    [mappedVariables]
  );

  // Expose methods globally to enable themes to programmatically interface with popups.
  window.OfferPopup.submit = handleSubmit;
  window.OfferPopup.close = handleClose;

  Modal.setAppElement(appRoot);

  if (!offer || !product) {
    return null;
  }

  return (
    <Modal
      closeTimeoutMS={!previewMode ? 200 : 0}
      parentSelector={() => renderTo || document.body}
      isOpen={open || !!renderTo}
      shouldFocusAfterRender={!renderTo}
      shouldCloseOnOverlayClick={offer.enableMaskClose}
      shouldCloseOnEsc={offer.enableEscClose}
      contentLabel="Offer Modal"
      onRequestClose={handleClose}
      className="offer-popup-modal"
      renderTo={renderTo}
      style={{
        overlay: {
          position: renderTo ? 'relative' : 'fixed',
          background: maskBackgroundColor,
          zIndex: renderTo ? 'auto' : 2147483647
        }
      }}
    >
      <ModalContentContainer dangerouslySetInnerHTML={{ __html: markup }} />
      {renderTo && <Mask onClick={onClick} />}
    </Modal>
  );
};

OfferPopup.propTypes = {
  appRoot: PropTypes.string.isRequired,
  open: PropTypes.bool,
  previewMode: PropTypes.bool,
  product: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  renderTo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onClose: PropTypes.func,
  onClick: PropTypes.func
};

OfferPopup.defaultProps = {
  open: false,
  previewMode: false,
  onClose: () => {}
};

export default OfferPopup;
