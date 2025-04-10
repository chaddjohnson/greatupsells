import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import ReactModal from 'react-modal';
import clsx from 'clsx';
import styled, { createGlobalStyle, StyleSheetManager } from 'styled-components';
import OfferTheme from '../OfferTheme';
import Overlay from './Overlay';
import Content from './Content';
import ContentContainer from './ContentContainer';
import Mask from './Mask';

const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${(props) => (props.open && !props.designMode ? 'hidden !important' : 'auto')};
  }
`;

const StyledFrame = styled(Frame)`
  border: 0;
  position: ${(props) => (props.designMode ? 'static' : 'fixed')};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: ${(props) => (props.designMode ? '100%' : '100vw')};
  height: ${(props) => (props.designMode ? '100%' : '100vh')};
  max-width: ${(props) => (props.forceDisplayType === 'mobile' ? `${375 * props.designModeZoom}px` : 'none')};
  min-height: ${(props) => (props.designMode ? '1500px' : 0)};
  z-index: ${(props) => (props.designMode ? 1 : 2147483647)};

  @media screen and (min-width: 768px) {
    &&& {
      min-width: ${(props) => (props.designMode && props.forceDisplayType === 'desktop' ? '1200px' : 0)};
    }
  }
`;

const OfferPopup = ({
  className,
  contextRef,
  open = false,
  designMode = false,
  designModeZoom = 1,
  forceDisplayType,
  theme,
  ThemeComponent,
  shop,
  offer,
  locale,
  countryCode,
  currency,
  triggerProduct = {},
  offeredProducts = [],
  shopifyCartItems = [],
  shopifyCartTotal,
  shopifyCartItemCount,
  onAddProducts = () => {},
  onReplaceProduct = () => {},
  onClose = () => {},
  onClick = () => {}
}) => {
  const [frameRef, setFrameRef] = useState(null);
  const [modalRef, setModalRef] = useState(null);
  const [upsellAccepted, setUpsellAccepted] = useState(false);

  // Internal flag for controling whether the actual modal is open. Faacilitates animations.
  // See https://github.com/reactjs/react-modal/blob/master/docs/styles/transitions.md.
  const [modalAfterOpen, setModalAfterOpen] = useState(false);

  const maskBackgroundColor = useMemo(() => {
    const defaultMaskBackgroundColor = ['POST_PURCHASE', 'THANK_YOU_PAGE', 'ORDER_STATUS_PAGE'].includes(offer.strategy)
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

    const isCartUpsell = offer.strategy === 'UPSELL' && window.location.pathname.includes('/cart');

    setModalAfterOpen(false);

    // Delay calling the onClose callback (which unmounts this component) until
    // the modal within the iframe has a chance to close. Animations will not
    // work without this.
    setTimeout(() => {
      onClose();

      // Reload the cart on upsell so that new items show.
      if (isCartUpsell && upsellAccepted) {
        window.location.reload();
      }
    }, 350);
  };

  const handleAfterOpen = () => {
    if (!designMode) {
      setModalAfterOpen(true);

      setTimeout(() => {
        modalRef.focus();
      });
    }
  };

  const handleReplaceProduct = async (...args) => {
    setUpsellAccepted(true);
    await onReplaceProduct(...args);
  };

  useEffect(() => {
    // Reload the iframe if the strategy changes (in design mode) to ensure the correct dummy data displays.
    // This is a workaround for images not showing correctly.
    frameRef?.contentWindow.location.reload();
  }, [frameRef, offer.strategy]);

  if (!offer) {
    return null;
  }
  if (!open) {
    return null;
  }

  // Reference: https://codesandbox.io/s/react-iframe-examples-36k1x?file=/src/examples/with-styled-components.js
  return (
    <>
      <GlobalStyle open={open} designMode={designMode} />
      <StyledFrame
        className={clsx('offer-iframe', className)}
        title="Offer"
        ref={(frame) => frame && setFrameRef(frame?.node || frame?.base)}
        head={
          <>
            <meta charSet="UTF-8" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
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
        designMode={designMode}
        designModeZoom={designModeZoom}
        forceDisplayType={forceDisplayType}
      >
        <FrameContextConsumer>
          {({ document }) => {
            ReactModal.setAppElement(document.body);

            if (contextRef) {
              contextRef.current = document;
            }

            return (
              <StyleSheetManager target={document.head}>
                <ReactModal
                  contentRef={setModalRef}
                  closeTimeoutMS={333}
                  parentSelector={() => document.body}
                  isOpen={open}
                  shouldFocusAfterRender={!designMode}
                  shouldCloseOnOverlayClick={offer.enableMaskClose}
                  shouldCloseOnEsc={offer.enableEscClose}
                  contentLabel="Offer Modal"
                  className={clsx(
                    designMode && 'design-mode',
                    open && designMode && 'open',
                    modalAfterOpen && 'open',
                    !!offer.animation && !designMode && offer.animation
                  )}
                  overlayClassName={clsx('overlay', !!offer.animation && !designMode && 'animated')}
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
                      className={clsx(offer.strategy.toLowerCase(), contentProps.className)}
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
                    designMode={designMode}
                    forceDisplayType={forceDisplayType}
                  >
                    <OfferTheme
                      context={frameRef?.contentWindow}
                      shop={shop}
                      offer={offer}
                      theme={theme}
                      ThemeComponent={ThemeComponent}
                      locale={locale}
                      countryCode={countryCode}
                      currency={currency}
                      triggerProduct={triggerProduct}
                      offeredProducts={offeredProducts}
                      shopifyCartItems={shopifyCartItems}
                      shopifyCartTotal={shopifyCartTotal}
                      shopifyCartItemCount={shopifyCartItemCount}
                      forceDisplayType={forceDisplayType}
                      handlers={{ handleClose, handleSubmit }}
                      onAddProducts={onAddProducts}
                      onReplaceProduct={handleReplaceProduct}
                    />
                  </ContentContainer>
                  {designMode && <Mask onClick={onClick} />}
                </ReactModal>
              </StyleSheetManager>
            );
          }}
        </FrameContextConsumer>
      </StyledFrame>
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
  ThemeComponent: PropTypes.func,
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

export default OfferPopup;
