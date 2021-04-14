import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import styled, { StyleSheetManager } from 'styled-components';
import { useLiquid } from 'react-liquid';

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
  className,
  open,
  designMode,
  theme,
  offer,
  triggerProduct,
  offeredProducts,
  onClose,
  onClick
}) => {
  const [iframeRef, setIframeRef] = useState(null);

  const doc = iframeRef?.contentWindow?.document;
  const mountNode = doc?.body;
  const insertionTarget = useMemo(() => doc?.createElement('link'), [doc]);

  const handleSubmit = (event) => {
    if (!event) {
      throw new Error('No event object passed to form submission handler');
    }

    event.preventDefault();

    if (designMode) {
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
    if (!designMode) {
      onClose();
    }
  };

  // Set up template variables.
  const mappedVariables = useMemo(
    () =>
      theme.variables.reduce(
        (map, { name, value }) => ({
          ...map,
          [name]: value
        }),
        {}
      ),
    [theme.variables]
  );

  // Generate the markup.
  const { markup } = useLiquid(theme.template, {
    ...mappedVariables,
    triggerProduct,
    offeredProducts,
    submitHandler: 'window.parent.OfferPopup.submit(event)',
    closeHandler: 'window.parent.OfferPopup.close()'
  });

  const maskBackgroundColor = useMemo(
    () => mappedVariables.maskBackgroundColor || 'rgba(0, 0, 0, 0.5)',
    [mappedVariables]
  );

  // Expose methods globally to enable themes to programmatically interface with popups.
  window.OfferPopup.submit = handleSubmit;
  window.OfferPopup.close = handleClose;

  Modal.setAppElement(mountNode);

  useEffect(() => {
    if (insertionTarget) {
      doc.head.append(insertionTarget);
    }
  }, [doc, insertionTarget]);

  if (!offer) {
    return null;
  }

  // Reference: https://codesandbox.io/s/react-iframe-examples-36k1x?file=/src/examples/with-styled-components.js
  return (
    <iframe
      className={className}
      title="Preview"
      ref={setIframeRef}
      style={{
        position: !designMode ? 'fixed' : 'static',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: 2147483647
      }}
    >
      {mountNode &&
        createPortal(
          <>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  body {
                    margin: 0;
                    padding: 0;
                  }
                `
              }}
            />
            <StyleSheetManager target={insertionTarget}>
              <Modal
                closeTimeoutMS={200}
                parentSelector={() => mountNode}
                isOpen={open}
                shouldFocusAfterRender={!designMode}
                shouldCloseOnOverlayClick={offer.enableMaskClose}
                shouldCloseOnEsc={offer.enableEscClose}
                contentLabel="Offer Modal"
                onRequestClose={handleClose}
                className="offer-popup-modal"
                designMode={designMode}
                style={{
                  overlay: {
                    position: 'fixed',
                    background: maskBackgroundColor,
                    zIndex: 2147483647,
                    height: '100%'
                  }
                }}
              >
                <ModalContentContainer
                  dangerouslySetInnerHTML={{ __html: markup }}
                />
                {designMode && <Mask onClick={onClick} />}
              </Modal>
            </StyleSheetManager>
          </>,
          mountNode
        )}
    </iframe>
  );
};

OfferPopup.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.arrayOf(PropTypes.object),
  offer: PropTypes.object.isRequired,
  designMode: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func
};

OfferPopup.defaultProps = {
  open: false,
  designMode: false,
  onClose: () => {}
};

export default OfferPopup;
