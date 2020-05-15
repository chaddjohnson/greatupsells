import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import {
  AddToCartButton,
  CancelButton,
  Mask,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from './components';

const OfferPopup = (props) => {
  const { appRoot, renderTo, offer, product, onClick } = props;
  const [open, setOpen] = useState(props.open);

  const handleClose = () => !renderTo && setOpen(false);

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
                  {product.title} x {offer.upsellProductsQuantity}
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
                {product.title} x {offer.upsellProductsQuantity}
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
      {renderTo && <Mask onClick={onClick}></Mask>}
    </Modal>
  );
};

OfferPopup.propTypes = {
  appRoot: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  renderTo: PropTypes.object,
  onClick: PropTypes.func
};

OfferPopup.defaultProps = {
  open: false
};

export default OfferPopup;
