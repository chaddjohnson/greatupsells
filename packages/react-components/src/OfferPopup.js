import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
// import {
//   AddToCartButton,
//   CancelButton,
//   Mask,
//   ModalBody,
//   ModalCloseButton,
//   ModalContainer,
//   ModalFooter,
//   ModalHeader,
//   ModalTitle
// } from './components';

export const ModalContainer = styled.div`
  background-color: white;
  width: 700px;
  height: auto;
  padding: 24px;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  text-align: center;
  box-sizing: border-box;
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

export const ModalCloseButton = styled.div`
  position: absolute;
  right: -12px;
  top: -12px;
  font-weight: bold;
  font-family: Garamond, 'Apple Garamond';
  font-size: 18px;
  padding: 8.5px 0 0 0.5px;
  line-height: 0;
  color: white;
  background-color: black;
  width: 26px;
  height: 26px;
  border: 3px solid white;
  border-radius: 14px;
  box-shadow: 0 2px 2px #888888;
  cursor: pointer;
`;

export const ModalHeader = styled.header`
  border-bottom: 1px solid #eee;
  margin-bottom: 18px;
  max-width: 400px;
  margin: auto;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1.2;
  margin: 0 0 17.5px;
`;

export const ModalBody = styled.div`
  max-height: 50%;
  overflow: hidden auto;
  max-width: 400px;
  margin: auto;

  a {
    color: black;
    text-decoration: none;
  }

  img {
    border: none;
  }
`;

export const ModalFooter = styled.footer`
  margin-top: 24px;
  max-width: 400px;
  margin: auto;
`;

export const AddToCartButton = styled.button`
  width: 100%;
  height: 35px;
  color: white;
  background-color: #91bd49;
  font-weight: 600;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 18px;
  cursor: pointer;
`;

export const CancelButton = styled.button`
  width: auto;
  display: block;
  background: none;
  border: none;
  padding: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: 18px;
  color: #c4c4c4;
  cursor: pointer;
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
  onClose,
  onClick
}) => {
  const handleClose = () => !renderTo && onClose();

  Modal.setAppElement(appRoot);

  if (!offer || !product) {
    return null;
  }

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
      <ModalContainer
        style={{ backgroundColor: offer.popupTheme.popupBackgroundColor }}
      >
        <ModalCloseButton aria-label="Close offer modal" onClick={handleClose}>
          &times;
        </ModalCloseButton>
        <ModalHeader>
          <ModalTitle style={{ color: offer.popupTheme.callToActionTextColor }}>
            {offer.callToActionText}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {offer.enableProductLinks ? (
            <a
              href="https://neatowebsolutions-chad.myshopify.com/products/fancy-shoes"
              target="_blank"
              rel="noopener noreferrer"
              title="Click to view this product in a new tab"
            >
              <figure>
                <img
                  src="https://via.placeholder.com/150x100"
                  alt={product.title}
                />
                <figcaption>
                  {product.title} x {offer.minimumProductsQuantity}
                </figcaption>
              </figure>
            </a>
          ) : (
            <figure>
              <img
                src="https://via.placeholder.com/150x100"
                alt={product.title}
              />
              <figcaption>
                {product.title} x {offer.minimumProductsQuantity}
              </figcaption>
            </figure>
          )}
          <div>
            <strong style={{ color: offer.popupTheme.salePriceTextColor }}>
              ${product.price}
            </strong>
            <s style={{ color: offer.popupTheme.priceTextColor }}>
              ${product.salePrice}
            </s>
          </div>
        </ModalBody>
        <ModalFooter>
          <AddToCartButton
            style={{
              backgroundColor: offer.popupTheme.actionButtonBackgroundColor,
              color: offer.popupTheme.actionButtonTextColor
            }}
          >
            {offer.actionButtonText}
          </AddToCartButton>
          <CancelButton
            style={{ color: offer.popupTheme.cancelButtonTextColor }}
            onClick={handleClose}
          >
            {offer.cancelButtonText}
          </CancelButton>
          {offer.enableTimer && (
            <div>
              <p>Offer ends in:</p>
              <p>05:00</p>
            </div>
          )}
        </ModalFooter>
      </ModalContainer>
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
