import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLiquid } from 'react-liquid';
import { useCookies } from '@greatupsells/react-hooks';
import useDataTranslation from './dataTranslation';
import useDataBinding from './dataBinding';

const OfferTheme = ({
  shop,
  offer,
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts,
  theme,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  handlers,
  forceDisplayType,
  context,
  container,
  onAddProducts,
  onReplaceProduct
}) => {
  const { getCookie } = useCookies();

  const [addedQuantities, setAddedQuantities] = useState(
    [...Array(offeredProducts.length).keys()].map(() => 0)
  );
  const [checkoutUrl, setCheckoutUrl] = useState(
    getCookie('greatupsellsDraftOrderInvoiceUrl') || '/checkout'
  );

  const {
    translateProductData,
    translateTriggerProductData
  } = useDataTranslation({ shop, offer, locale, countryCode, currency });

  const actionButtonUrl = useMemo(() => {
    if (offer.actionButtonBehavior === 'CHECKOUT') {
      return checkoutUrl;
    } else if (offer.actionButtonBehavior === 'CART') {
      return '/cart';
    } else if (offer.actionButtonBehavior === 'PAGE') {
      return 'javascript:window.parent.Offer.close()'; // eslint-disable-line no-script-url
    } else if (offer.actionButtonBehavior === 'LINK') {
      return offer.actionButtonLink;
    }

    return checkoutUrl;
  }, [offer.actionButtonBehavior, offer.actionButtonLink, checkoutUrl]);

  const actionButtonTarget = useMemo(() => {
    const openInNewTab =
      offer.actionButtonBehavior === 'LINK' &&
      offer.actionButtonLinkOpenInNewTab;

    if (openInNewTab) {
      return '_blank';
    }

    return '_top';
  }, [offer.actionButtonBehavior, offer.actionButtonLinkOpenInNewTab]);

  const translatedOfferedProducts = useMemo(() => {
    if (offeredProducts) {
      return offeredProducts.map(translateProductData);
    }
  }, [offer, offeredProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set up template variables.
  const mappedVariables = useMemo(
    () =>
      theme?.variables.reduce((map, { name, type, value, options = {} }) => {
        // Optionally filter by strategy.
        if (options.strategy && options.strategy !== offer.strategy) {
          return map;
        }

        // Cast "option" variables to boolean.
        if (type === 'OPTION') {
          value = value === 'true';
        }

        return {
          ...map,
          [name]: value
        };
      }, {}),
    [theme, offer]
  );

  const translatedTriggerProduct = useMemo(() => {
    if (triggerProduct) {
      return translateTriggerProductData(triggerProduct, shopifyCartItems);
    }
  }, [offer, triggerProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  const templateVariables = useMemo(
    () => ({
      ...mappedVariables,
      triggerProduct: translatedTriggerProduct,
      offeredProducts: translatedOfferedProducts,
      actionButtonUrl,
      actionButtonTarget,
      strategy: offer.strategy,
      enableBundling: offer.enableBundling,
      enableVariantSelection: offer.enableVariantSelection,
      enableQuantitySelection: offer.enableQuantitySelection
    }),
    [
      mappedVariables,
      translatedTriggerProduct,
      translatedOfferedProducts,
      offer,
      actionButtonUrl,
      actionButtonTarget
    ]
  );

  const handleQuantityAdd = (index, quantity) =>
    setAddedQuantities(
      addedQuantities.map((addedQuantity, addedQuantityIndex) => {
        return addedQuantityIndex === index
          ? addedQuantity + quantity
          : addedQuantity;
      })
    );

  // Generate the markup.
  const { markup: html } = useLiquid(theme?.template.html, {
    ...templateVariables,
    submitHandler: 'window.parent.Offer.submit(event)',
    ...handlers
  });
  let { markup: css } = useLiquid(theme?.template.css, templateVariables);
  const { markup: javascript } = useLiquid(theme?.template.javascript, {
    ...templateVariables,
    submitHandler: 'window.parent.Offer.submit(event)',
    ...handlers
  });

  // Replace device-specific media queries if forcing display type.
  // Reference: https://github.com/cypress-io/cypress/issues/970#issuecomment-767860917
  if (forceDisplayType === 'desktop') {
    // Add "device" to media queries if missing.
    css = css?.replace(
      /(\(\s*)(min|max)-(width|height)(\s*:)/g,
      '$1$2-device-$3$4'
    );
  } else if (forceDisplayType === 'mobile') {
    // Remove "device" from media queries if present.
    css = css?.replace(
      /(\(\s*)(min|max)-device-(width|height)(\s*:)/g,
      '$1$2-$3$4'
    );
  }

  // Set up data binding for popup.
  useDataBinding({
    context,
    shop,
    offer,
    currency,
    offeredProducts: translatedOfferedProducts,
    addedQuantities,
    shopifyCartTotal,
    shopifyCartItemCount,
    html,
    css,
    javascript,
    container,
    onAddProducts,
    onReplaceProduct,
    onCheckoutUrlUpdate: setCheckoutUrl,
    onQuantityAdd: handleQuantityAdd
  });

  // Inject scripts. These must be added programmatically instead of via markup, or they will be ignored.
  useEffect(() => {
    const externalScripts = [];
    let externalScript;
    let customScript;
    let customStyle;
    const documentContext =
      context?.contentWindow?.document ||
      context?.contentDocument ||
      context?.document;

    if (documentContext) {
      // Link to external scripts.
      theme?.template.scripts?.forEach((scriptUrl) => {
        externalScript = documentContext.createElement('script');
        externalScript.type = 'text/javascript';
        externalScript.src = scriptUrl;
        externalScripts.push(externalScript);
        documentContext.head.appendChild(externalScript);
      });

      // Inject custom JavaScript.
      customScript = documentContext.createElement('script');
      customScript.type = 'text/javascript';
      customScript.text = javascript;
      documentContext.head.appendChild(customScript);

      // Inject CSS.
      customStyle = documentContext.createElement('style');
      customStyle.innerHTML = css;
      documentContext.head.appendChild(customStyle);
    }

    return () => {
      if (documentContext) {
        // Remove scripts.
        externalScripts.forEach((current) =>
          documentContext.head.removeChild(current)
        );
        documentContext.head.removeChild(customScript);

        // Remove CSS.
        documentContext.head.removeChild(customStyle);
      }
    };
  }, [context, translatedOfferedProducts, javascript, css, theme]);

  if (!offer || !html) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

OfferTheme.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  locale: PropTypes.string,
  countryCode: PropTypes.string,
  currency: PropTypes.string,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.arrayOf(PropTypes.object),
  theme: PropTypes.object.isRequired,
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  handlers: PropTypes.object,
  forceDisplayType: PropTypes.oneOf(['desktop', 'mobile']),
  context: PropTypes.object,
  container: PropTypes.object,
  onAddProducts: PropTypes.func,
  onReplaceProduct: PropTypes.func
};

OfferTheme.defaultProps = {
  locale: 'en',
  countryCode: 'US',
  currency: 'USD',
  handlers: {}
};

export default OfferTheme;
