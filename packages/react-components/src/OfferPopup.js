import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import styled, { StyleSheetManager } from 'styled-components';
import { useLiquid, liquidEngine } from 'react-liquid';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';

const initialIframeHeight = 1000;

const calculateDiscountedPrice = (offer, price) => {
  // Shopify stores prices as strings. Ensure it is a number here.
  price = parseFloat(price);

  if (!offer) {
    throw new Error('`offer` must be provided');
  }
  if (typeof price !== 'number' || Number.isNaN(price)) {
    throw new Error('`price` must be a number');
  }

  let discountedPrice = price;

  switch (offer.discountType) {
    case 'PERCENTAGE':
      // Reduce the price by the discount amount (a percentage).
      discountedPrice = price - price * offer.discountAmount;
      break;

    case 'USD':
      // Reduce the price by the discount amount (a monetary amount).
      discountedPrice = price - offer.discountAmount;
      break;

    case 'SET_PRICE':
      // Use the discount amount as the price.
      discountedPrice = offer.discountAmount;
      break;

    case 'NO_DISCOUNT':
    default:
      // No discount, so adjust nothing.
      break;
  }

  // Round price. Reference: https://stackoverflow.com/a/11832950/83897.
  discountedPrice = Math.round((discountedPrice + Number.EPSILON) * 100) / 100;

  // Safeguard against the calculated price being negative.
  return Math.max(discountedPrice, 0);
};

const getThumbnailImageUrl = (url) => {
  return url && url.replace(/\.(jpg|png)(\?|$)/i, '_400x.$1$2');
};

liquidEngine.registerFilter('addProductHandler', (offeredProduct, quantity) => {
  // Unfortunately there is nothing to do if no offered product is available.
  if (!offeredProduct) {
    return '';
  }

  const shopifyProductId = offeredProduct.id;
  const shopifyVariantId = offeredProduct.variants[0]?.id;

  return `window.parent.OfferPopup.addProduct(${shopifyProductId}, ${shopifyVariantId}, ${quantity})`;
});

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
  max-width: ${(props) =>
    props.forceDisplayType === 'mobile' ? '375px' : '100%'};
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
  designModeZoom,
  forceDisplayType,
  theme,
  shop,
  offer,
  triggerProduct,
  offeredProducts,
  onAddProduct,
  onClose,
  onClick
}) => {
  const [iframeRef, setIframeRef] = useState(null);
  const [iframeHeight, setIframeHeight] = useState(initialIframeHeight);
  const [modalRef, setModalRef] = useState(null);

  const { locale, countryCode, currency } = shop;
  const { formatCurrency } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });

  const iframeDocument =
    iframeRef?.contentWindow?.document ||
    iframeRef?.contentDocument ||
    iframeRef?.document;
  const mountNode = iframeDocument?.body;
  const insertionTarget = useMemo(() => iframeDocument?.createElement('link'), [
    iframeDocument
  ]);

  const fixIframeHeight = () => {
    if (!iframeDocument || !modalRef) {
      return;
    }

    // This only applies to design mode.
    if (!designMode) {
      return;
    }

    setTimeout(async () => {
      // Wait for all images to load so that we can get an accurate measure of
      // the content height.
      // Reference: https://stackoverflow.com/a/60949881/83897
      await Promise.all(
        Array.from(iframeDocument.images).map((image) => {
          if (image.complete) {
            return Promise.resolve(image.naturalHeight !== 0);
          }
          return new Promise((resolve) => {
            image.addEventListener('load', () => resolve());
            image.addEventListener('error', () => resolve());
          });
        })
      );

      // Workaround: Set the iframe height to some large -- taller than the content
      // will likely actually be. Do so because `offsetHeight` does not reflect the
      // iframe's content height unless the iframe is actualy tall enough to
      // accommodate the content.
      setIframeHeight(initialIframeHeight);

      // Set the iframe height to approximately the modal content height. Do so via
      // a timeout to allow the iframe height to temporarily increase per above.
      setTimeout(
        () => setIframeHeight((modalRef.offsetHeight - 10) * designModeZoom),
        0
      );
    }, 0);
  };

  const translateProductData = useCallback(
    (product = {}) => {
      const { shopifyProductData } = product;

      if (!shopifyProductData) {
        return;
      }

      const imagesById =
        shopifyProductData.images?.reduce(
          (map, image) => ({ ...map, [image.id]: image }),
          {}
        ) || {};

      return {
        id: shopifyProductData.id,
        title: shopifyProductData.title,
        url: `/products/${shopifyProductData.handle}`,
        image: {
          src: getThumbnailImageUrl(shopifyProductData.image?.src),
          alt: shopifyProductData.image?.alt || shopifyProductData.title
        },
        variants: shopifyProductData.variants?.map((variant) => ({
          id: variant.id,
          title: variant.title,
          price: formatCurrency(variant.price),
          salePrice: formatCurrency(
            calculateDiscountedPrice(offer, parseFloat(variant.price))
          ),
          sku: variant.sku,
          image: {
            src: getThumbnailImageUrl(
              imagesById[variant.image_id]?.src || shopifyProductData.image?.src
            ),
            alt:
              imagesById[variant.image_id]?.alt ||
              shopifyProductData.image?.alt ||
              shopifyProductData.title
          },
          inventory: variant.inventory_quantity
        }))
      };
    },
    [offer, formatCurrency]
  );

  const handleAddProduct = async (
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    await onAddProduct(offer._id, shopifyProductId, shopifyVariantId, quantity);
  };

  const handleSubmit = async (event) => {
    if (!event) {
      throw new Error('No event object passed to form submission handler');
    }

    event.preventDefault();

    // if (designMode) {
    //   return;
    // }

    // Collect form values.
    // const form = event.target;
    // const formData = new FormData(form);
    // const data = Object.fromEntries(formData.entries());

    // TODO: Create data model for tracking submissions.
    // TODO: Save submission.
    // await ...
  };

  const handleClose = () => {
    if (!designMode) {
      onClose();
    }
  };

  // Set up template variables.
  const mappedVariables = useMemo(
    () =>
      theme.variables.reduce((map, { name, value, type }) => {
        // Cast "option" variables to boolean.
        if (type === 'option') {
          value = value === 'true';
        }

        return {
          ...map,
          [name]: value
        };
      }, {}),
    [theme.variables]
  );

  const maskBackgroundColor =
    mappedVariables.maskBackgroundColor || 'rgba(0, 0, 0, 0.5)';

  const translatedTriggerProduct = useMemo(() => {
    if (triggerProduct) {
      return translateProductData(triggerProduct);
    }
  }, [translateProductData, triggerProduct]);

  const translatedOfferedProducts = useMemo(() => {
    if (offeredProducts) {
      return offeredProducts.map(translateProductData);
    }
  }, [translateProductData, offeredProducts]);

  // Generate the markup.
  let { markup: html } = useLiquid(theme.template.html, {
    ...mappedVariables,
    triggerProduct: translatedTriggerProduct,
    offeredProducts: translatedOfferedProducts,
    submitHandler: 'window.parent.OfferPopup.submit(event)',
    closeHandler: 'window.parent.OfferPopup.close()'
  });
  const { markup: css } = useLiquid(theme.template.css, mappedVariables);
  const { markup: javascript } = useLiquid(theme.template.javascript, {
    ...mappedVariables,
    triggerProduct: translatedTriggerProduct,
    offeredProducts: translatedOfferedProducts,
    submitHandler: 'window.parent.OfferPopup.submit(event)',
    closeHandler: 'window.parent.OfferPopup.close()'
  });

  // Replace device-specific media queries if forcing display type.
  // Reference: https://github.com/cypress-io/cypress/issues/970#issuecomment-767860917
  if (forceDisplayType === 'desktop') {
    // Add "device" to media queries if missing.
    html = html?.replace(
      /(\(\s*)(min|max)-(width|height)(\s*:)/,
      '$1$2-device-$3$4'
    );
  } else if (forceDisplayType === 'mobile') {
    // Remove "device" from media queries if present.
    html = html?.replace(
      /(\(\s*)(min|max)-device-(width|height)(\s*:)/,
      '$1$2-$3$4'
    );
  }

  // Expose methods globally to enable themes to programmatically interface with popups.
  window.OfferPopup.addProduct = handleAddProduct;
  window.OfferPopup.submit = handleSubmit;
  window.OfferPopup.close = handleClose;

  Modal.setAppElement(mountNode);

  useEffect(() => {
    if (insertionTarget) {
      // Inject Styled Components styling.
      iframeDocument.head.append(insertionTarget);
    }
  }, [iframeDocument, insertionTarget]);

  // Fix the iframe height as dependencies change.
  useEffect(fixIframeHeight, [
    iframeDocument,
    modalRef,
    theme.template,
    designMode,
    designModeZoom
  ]);

  // Fix the iframe height when scrolling occurs.
  // useEffect(() => {
  //   window.addEventListener('scroll', fixIframeHeight);

  //   return () => {
  //     window.removeEventListener('scroll', fixIframeHeight);
  //   };
  // });

  if (!offer || !html) {
    return null;
  }

  if (!open) {
    return null;
  }

  // Reference: https://codesandbox.io/s/react-iframe-examples-36k1x?file=/src/examples/with-styled-components.js
  return (
    <iframe
      className={className}
      title="Preview"
      ref={setIframeRef}
      style={{
        border: 0,
        position: designMode ? 'static' : 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: designMode ? '100%' : '100vw',
        height: designMode ? '100%' : '100vh',
        minHeight: `${iframeHeight}px`,
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
                  ${css}
                `
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: javascript
              }}
            />
            <StyleSheetManager target={insertionTarget}>
              <Modal
                contentRef={setModalRef}
                closeTimeoutMS={200}
                parentSelector={() => mountNode}
                isOpen={true}
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
                  },
                  content: {
                    zoom: designMode ? designModeZoom : 1
                  }
                }}
              >
                <ModalContentContainer
                  forceDisplayType={forceDisplayType}
                  dangerouslySetInnerHTML={{ __html: html }}
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
  designMode: PropTypes.bool,
  designModeZoom: PropTypes.number,
  forceDisplayType: PropTypes.oneOf(['desktop', 'mobile']),
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.arrayOf(PropTypes.object),
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  onAddProduct: PropTypes.func,
  onClose: PropTypes.func,
  onClick: PropTypes.func
};

OfferPopup.defaultProps = {
  open: false,
  designMode: false,
  designModeZoom: 1,
  triggerProduct: {},
  offeredProducts: [],
  onAddProduct: () => {},
  onClose: () => {}
};

export default OfferPopup;
