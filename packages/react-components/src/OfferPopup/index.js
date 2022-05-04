import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import ReactModal from 'react-modal';
import clsx from 'clsx';
import { createGlobalStyle, StyleSheetManager } from 'styled-components';
import OfferTheme from '../OfferTheme';
import Overlay from './Overlay';
import Content from './Content';
import ContentContainer from './ContentContainer';
import Mask from './Mask';

const initialIframeHeight = 1000;

const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${(props) =>
      props.modalOpen && !props.designMode ? 'hidden !important' : 'auto'};
  }
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
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  onAddProducts,
  onReplaceProduct,
  onClose,
  onClick
}) => {
  const [frameRef, setFrameRef] = useState(null);
  const [frameDocument, setFrameDocument] = useState(null);
  const [iframeHeight, setIframeHeight] = useState(initialIframeHeight);
  const [modalRef, setModalRef] = useState(null);
  const [modalContentContainerRef, setModalContentContainerRef] = useState(
    null
  );

  // Internal flag for controling whether the actual modal is open. Faacilitates animations.
  // See https://github.com/reactjs/react-modal/blob/master/docs/styles/transitions.md.
  const [modalOpen, setModalOpen] = useState(designMode);
  const [modalAfterOpen, setModalAfterOpen] = useState(false);

  const fixIframeHeight = () => {
    if (!frameDocument || !modalRef) {
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
        Array.from(frameDocument.images).map((image) => {
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

  const maskBackgroundColor = useMemo(() => {
    const defaultMaskBackgroundColor = [
      'POST_CHECKOUT',
      'THANK_YOU_PAGE'
    ].includes(offer.strategy)
      ? '#FFFFFF'
      : 'rgba(0, 0, 0, 0.5)';

    return (
      theme?.variables.find(({ name }) => {
        return name === 'maskBackgroundColor';
      })?.value || defaultMaskBackgroundColor
    );
  }, [theme, offer]);

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
    if (designMode) {
      return;
    }

    const isCartUpsell =
      offer.strategy === 'UPSELL' && window.location.pathname.includes('/cart');

    setModalOpen(false);
    setModalAfterOpen(false);

    // Delay calling the onClose callback (which unmounts this component) until
    // the modal within the iframe has a chance to close. Animations will not
    // work without this.
    setTimeout(() => {
      onClose();

      // Reload the cart on upsell so that new items show.
      if (isCartUpsell) {
        window.location.reload();
      }
    }, 350);
  };

  const handleAfterOpen = () => {
    if (!designMode) {
      setModalAfterOpen(true);
    }
  };

  // Expose methods globally to enable themes to programmatically interface with popups.
  if (typeof window !== 'undefined') {
    window.Offer.submit = handleSubmit;
    window.Offer.close = handleClose;
  }

  // Fix the iframe height as dependencies change.
  useEffect(fixIframeHeight, [
    frameDocument,
    modalRef,
    designMode,
    designModeZoom
  ]);

  useEffect(() => {
    if (open) {
      setModalOpen(true);

      if (!designMode) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            setModalAfterOpen(true);
          });
        }, 20);
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fix the iframe height when scrolling occurs.
  // useEffect(() => {
  //   window.addEventListener('scroll', fixIframeHeight);

  //   return () => {
  //     window.removeEventListener('scroll', fixIframeHeight);
  //   };
  // });

  if (!open) {
    return null;
  }

  // Reference: https://codesandbox.io/s/react-iframe-examples-36k1x?file=/src/examples/with-styled-components.js
  return (
    <>
      <GlobalStyle modalOpen={modalOpen} designMode={designMode} />
      <Frame
        className={className}
        title="Offer"
        ref={(frame) => frame && setFrameRef(frame?.node || frame?.base)}
        head={
          <>
            <meta charSet="UTF-8" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
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
                  * {
                    box-sizing: border-box;
                  }
                `
              }}
            />
          </>
        }
        style={{
          border: 0,
          position: designMode ? 'static' : 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: designMode ? '100%' : '100vw',
          height: designMode ? '100%' : '100vh',
          maxWidth: forceDisplayType === 'mobile' ? '375px' : 'none',
          minHeight: designMode ? `${iframeHeight}px` : 0,
          zIndex: designMode ? 1 : 2147483647
        }}
      >
        <FrameContextConsumer>
          {({ document }) => {
            setFrameDocument(document);
            ReactModal.setAppElement(document.body);

            return (
              <StyleSheetManager target={document.head}>
                <ReactModal
                  contentRef={setModalRef}
                  closeTimeoutMS={333}
                  parentSelector={() => document.body}
                  isOpen={modalOpen}
                  shouldFocusAfterRender={!designMode}
                  shouldCloseOnOverlayClick={offer.enableMaskClose}
                  shouldCloseOnEsc={offer.enableEscClose}
                  contentLabel="Offer Modal"
                  className={clsx(
                    designMode && 'design-mode',
                    modalOpen && designMode && 'open',
                    modalAfterOpen && 'open',
                    !!offer.animation && !designMode && offer.animation
                  )}
                  overlayClassName={clsx(
                    'overlay',
                    !!offer.animation && !designMode && 'animated'
                  )}
                  overlayElement={(overlayProps, contentElement) => (
                    <>
                      {contentElement}
                      <Overlay
                        {...overlayProps}
                        style={{
                          background: maskBackgroundColor
                        }}
                      />
                    </>
                  )}
                  contentElement={(contentProps, children) => (
                    <Content
                      {...contentProps}
                      style={{
                        zoom: designMode ? designModeZoom : 1
                      }}
                    >
                      {children}
                    </Content>
                  )}
                  onRequestClose={handleClose}
                  onAfterOpen={handleAfterOpen}
                >
                  <ContentContainer
                    className="content-container"
                    ref={setModalContentContainerRef}
                  >
                    <OfferTheme
                      shop={shop}
                      offer={offer}
                      locale={locale}
                      countryCode={countryCode}
                      currency={currency}
                      triggerProduct={triggerProduct}
                      offeredProducts={offeredProducts}
                      theme={theme}
                      shopifyCartItems={shopifyCartItems}
                      shopifyCartTotal={shopifyCartTotal}
                      shopifyCartItemCount={shopifyCartItemCount}
                      handlers={{
                        closeHandler: 'window.parent.Offer.close()'
                      }}
                      forceDisplayType={forceDisplayType}
                      context={frameRef?.contentWindow}
                      container={modalContentContainerRef}
                      onAddProducts={onAddProducts}
                      onReplaceProduct={onReplaceProduct}
                    />
                  </ContentContainer>
                  {designMode && <Mask onClick={onClick} />}
                </ReactModal>
              </StyleSheetManager>
            );
          }}
        </FrameContextConsumer>
      </Frame>
    </>
  );
};

OfferPopup.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  designMode: PropTypes.bool,
  designModeZoom: PropTypes.number,
  forceDisplayType: PropTypes.oneOf(['desktop', 'mobile']),
  theme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.arrayOf(PropTypes.object),
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  onAddProducts: PropTypes.func,
  onReplaceProduct: PropTypes.func,
  onClose: PropTypes.func,
  onClick: PropTypes.func
};

OfferPopup.defaultProps = {
  open: false,
  designMode: false,
  designModeZoom: 1,
  triggerProduct: {},
  offeredProducts: [],
  shopifyCartItems: [],
  onAddProducts: () => {},
  onReplaceProduct: () => {},
  onClose: () => {}
};

export default OfferPopup;
