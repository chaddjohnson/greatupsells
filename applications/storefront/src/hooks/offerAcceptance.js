import { useCookies } from '@greatupsells/react-hooks';
import useOfferTracking from './offerTracking';
import { useShopifyCart } from './shopifyCart';
import useShopifyDraftOrder from './shopifyDraftOrder';
import useShopifyCustomer from './shopifyCustomer';

const useOfferAcceptance = () => {
  const { getCookie, setCookie } = useCookies();
  const { trackOfferAcceptance } = useOfferTracking();
  const { shopifyCartItems, addVariantsToShopifyCart, removeVariantFromShopifyCart } = useShopifyCart();
  const { createShopifyDraftOrder, addVariantsToShopifyDraftOrder } = useShopifyDraftOrder();
  const { getUrlLocaleAndCountryCode } = useShopifyCustomer();
  const locale = getUrlLocaleAndCountryCode();

  const addProducts = async (offerId, items) => {
    let shopifyDraftOrderId = getCookie('greatupsellsDraftOrderId');
    let draftOrder = null;

    // Do not add Shopify cart items to draft order for Order Status or Thank You pages.
    const includeShopifyCartItems =
      !window.Shopify?.Checkout?.isOrderStatusPage && window.Shopify?.Checkout?.page !== 'thank_you';
    const includedCartItems = includeShopifyCartItems
      ? shopifyCartItems.map((item) => ({
          shopifyVariantId: item.variant_id,
          quantity: item.quantity
        }))
      : [];

    // Add the variant to the existing draft order if one exists.
    if (shopifyDraftOrderId) {
      draftOrder = await addVariantsToShopifyDraftOrder(shopifyDraftOrderId, items);
    }
    // Create a new draft order if one does not exist.
    else {
      // Create a new draft order. Include the offered items and items already in the cart.
      // Associate the new item with the offer.
      draftOrder = await createShopifyDraftOrder({
        lineItems: [
          ...items.map(({ shopifyVariantId, quantity }) => ({
            offerId,
            shopifyVariantId,
            quantity
          })),
          ...includedCartItems
        ]
      });

      shopifyDraftOrderId = draftOrder.id;

      // Track the draft order ID.
      setCookie('greatupsellsDraftOrderId', draftOrder.id, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the draft order checkout URL.
      setCookie('greatupsellsDraftOrderInvoiceUrl', `${draftOrder.invoice_url}?locale=${locale}`, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }

    // Add the accepted variant to the Shopify cart.
    await addVariantsToShopifyCart(items);

    // Accept the offer.
    await trackOfferAcceptance(offerId, items, shopifyDraftOrderId);
  };

  const replaceProduct = async (offerId, triggerShopifyProductId, shopifyProductId, shopifyVariantId) => {
    const triggerShopifyCartItemIndex = shopifyCartItems.findIndex((item) => item.product_id === triggerShopifyProductId);
    const triggerShopifyCartItem = shopifyCartItems[triggerShopifyCartItemIndex];
    const triggerShopifyVariantId = triggerShopifyCartItem?.variant_id;
    const quantity = 1;
    let shopifyDraftOrderId = getCookie('greatupsellsDraftOrderId');
    let draftOrder = null;

    // Abort if trigger product was not found in cart.
    if (!triggerShopifyCartItem || triggerShopifyCartItemIndex === -1) {
      return;
    }

    // Remove the trigger product from Shopify cart.
    await removeVariantFromShopifyCart(triggerShopifyVariantId, 1);

    // Add the accepted variant to the Shopify cart.
    await addVariantsToShopifyCart([{ shopifyVariantId, quantity }]);

    if (shopifyDraftOrderId) {
      // Add the new variant to the draft order.
      draftOrder = await addVariantsToShopifyDraftOrder(shopifyDraftOrderId, [
        {
          offerId,
          shopifyVariantId,
          quantity
        }
      ]);
    }
    // Create a new draft order if one does not exist.
    else {
      // Create a new draft order. Include the offered item and items already in the cart.
      // Associate the new item with the offer.
      draftOrder = await createShopifyDraftOrder({
        lineItems: [
          {
            offerId,
            shopifyVariantId,
            quantity
          },
          ...shopifyCartItems
            .filter((item, index) => index !== triggerShopifyCartItemIndex)
            .map((item) => ({
              shopifyVariantId: item.variant_id,
              quantity: item.quantity
            }))
        ]
      });

      shopifyDraftOrderId = draftOrder.id;

      // Track the draft order ID.
      setCookie('greatupsellsDraftOrderId', draftOrder.id, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the draft order checkout URL.
      setCookie('greatupsellsDraftOrderInvoiceUrl', `${draftOrder.invoice_url}?locale=${locale}`, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      [
        {
          shopifyProductId,
          shopifyVariantId,
          quantity
        }
      ],
      shopifyDraftOrderId
    );
  };

  return { addProducts, replaceProduct };
};

export default useOfferAcceptance;
