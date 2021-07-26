import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { StyleSheetManager } from 'styled-components';
import { useLiquid } from 'react-liquid';
import { useCookies } from '@neatowebsolutions/upselling-react-hooks';
import useDataTranslation from './dataTranslation';
import useDataBinding from './dataBinding';
import Modal from './Modal';
import ModalContentContainer from './ModalContentContainer';
import Mask from './Mask';

const initialIframeHeight = 1000;

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
  const { getCookie } = useCookies();

  const [iframeRef, setIframeRef] = useState(null);
  const [iframeHeight, setIframeHeight] = useState(initialIframeHeight);
  const [modalRef, setModalRef] = useState(null);
  const [modalContentContainerRef, setModalContentContainerRef] = useState(
    null
  );
  const [checkoutUrl, setCheckoutUrl] = useState(
    getCookie('upsellingDraftOrderCheckoutUrl')
  );
  const [addedQuantities, setAddedQuantities] = useState(
    [...Array(offeredProducts.length).keys()].map(() => 0)
  );

  const { translateProductData } = useDataTranslation(shop, offer);

  const iframeDocument =
    iframeRef?.contentWindow?.document ||
    iframeRef?.contentDocument ||
    iframeRef?.document;
  const iframeHeadNode = iframeDocument?.head;
  const iframeBodyNode = iframeDocument?.body;

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
      setTimeout(() => {
        setIframeHeight((modalRef.offsetHeight - 10) * designModeZoom);
      });
    });
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

  const handleQuantityAdd = (index, quantity) =>
    setAddedQuantities(
      addedQuantities.map((addedQuantity, addedQuantityIndex) => {
        return addedQuantityIndex === index
          ? addedQuantity + quantity
          : addedQuantity;
      })
    );

  // Set up template variables.
  const mappedVariables = useMemo(
    () =>
      theme.variables.reduce((map, { name, value, type }) => {
        // Cast "option" variables to boolean.
        if (type === 'OPTION') {
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
  }, [triggerProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  const translatedOfferedProducts = useMemo(() => {
    if (offeredProducts) {
      return offeredProducts.map(translateProductData);
    }
  }, [offeredProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  const templateVariables = useMemo(
    () => ({
      ...mappedVariables,
      triggerProduct: translatedTriggerProduct,
      offeredProducts: translatedOfferedProducts,
      checkoutUrl,
      enableBundling: offer.enableBundling,
      enableVariantSelection: offer.enableVariantSelection,
      enableQuantitySelection: offer.enableQuantitySelection,
      hideOutOfStockProducts: offer.hideOutOfStockProducts
    }),
    [
      mappedVariables,
      translatedTriggerProduct,
      translatedOfferedProducts,
      offer,
      checkoutUrl
    ]
  );

  // Generate the markup.
  let { markup: html } = useLiquid(theme.template.html, templateVariables);
  const { markup: css } = useLiquid(theme.template.css, templateVariables);
  const { markup: javascript } = useLiquid(theme.template.javascript, {
    ...templateVariables,
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
  window.OfferPopup.submit = handleSubmit;
  window.OfferPopup.close = handleClose;

  Modal.setAppElement(iframeBodyNode);

  // Set up data binding for popup.
  useDataBinding({
    iframe: iframeRef,
    shop,
    offer,
    offeredProducts: translatedOfferedProducts,
    addedQuantities,
    html,
    css,
    javascript,
    modalContentContainer: modalContentContainerRef,
    onAddProduct,
    onCheckoutUrlUpdate: setCheckoutUrl,
    onQuantityAdd: handleQuantityAdd
  });

  // Inject scripts. These must be added programmatically instead of via markup, or they will be ignored.
  useEffect(() => {
    const externalScripts = [];
    let externalScript;
    let customScript;

    if (iframeDocument) {
      // Link to external scripts.
      theme.template.scripts?.forEach((scriptUrl) => {
        externalScript = iframeDocument.createElement('script');
        externalScript.type = 'text/javascript';
        externalScript.src = scriptUrl;
        externalScripts.push(externalScript);
        iframeHeadNode.appendChild(externalScript);
      });

      // Inject custom JavaScript.
      customScript = iframeDocument.createElement('script');
      customScript.type = 'text/javascript';
      customScript.text = javascript;
      iframeHeadNode.appendChild(customScript);
    }

    return () => {
      if (iframeDocument) {
        externalScripts.forEach((current) =>
          iframeHeadNode.removeChild(current)
        );
        iframeHeadNode.removeChild(customScript);
      }
    };
  }, [
    iframeRef,
    iframeDocument,
    iframeHeadNode,
    translatedOfferedProducts,
    javascript,
    theme.template.scripts
  ]);

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
      {iframeHeadNode &&
        createPortal(
          <>
            <meta charSet="UTF-8" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin
            />
            <link
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
              rel="stylesheet"
            />
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
          </>,
          iframeHeadNode
        )}
      {iframeBodyNode &&
        createPortal(
          <>
            <StyleSheetManager target={iframeHeadNode}>
              <Modal
                contentRef={setModalRef}
                closeTimeoutMS={200}
                parentSelector={() => iframeBodyNode}
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
                  id="modal-content-container"
                  ref={setModalContentContainerRef}
                  forceDisplayType={forceDisplayType}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                {designMode && <Mask onClick={onClick} />}
              </Modal>
            </StyleSheetManager>
          </>,
          iframeBodyNode
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
