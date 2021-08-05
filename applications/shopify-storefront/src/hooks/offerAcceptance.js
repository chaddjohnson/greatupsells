import { useCookies } from '@neatowebsolutions/upselling-react-hooks';
import useOfferTracking from './offerTracking';
import { useShopifyCart } from './shopifyCart';
import useShopifyDraftOrder from './shopifyDraftOrder';

const useOfferAcceptance = () => {
  const { getCookie, setCookie } = useCookies();
  const { trackOfferAcceptance } = useOfferTracking();
  const {
    shopifyCartItems,
    addProductToShopifyCart,
    replaceProductInShopifyCart
  } = useShopifyCart();
  const {
    createShopifyDraftOrder,
    addProductToShopifyDraftOrder,
    removeDraftOrderLineItem
  } = useShopifyDraftOrder();

  const addProduct = async (
    offerId,
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    const draftOrderId = getCookie('upsellingDraftOrderId');
    let draftOrder = null;

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );

    // Add the accepted variant to the Shopify cart (so that it shows on the Cart page).
    await addProductToShopifyCart(shopifyVariantId, quantity);

    // Add the variant to the existing draft order if one exists.
    if (draftOrderId) {
      await addProductToShopifyDraftOrder(draftOrderId, {
        offerId,
        shopifyVariantId,
        quantity
      });
    }

    // Create a new draft order if one does not exist.
    if (!draftOrderId) {
      // Create a new draft order. Include the offered item and items already in the cart.
      // Associate the new item with the offer.
      draftOrder = await createShopifyDraftOrder({
        lineItems: [
          {
            offerId,
            shopifyVariantId,
            quantity
          },
          ...shopifyCartItems.map((item) => ({
            shopifyVariantId: item.variant_id,
            quantity: item.quantity
          }))
        ]
      });

      // Track the draft order ID.
      setCookie('upsellingDraftOrderId', draftOrder.id, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the draft order checkout URL.
      setCookie('upsellingDraftOrderCheckoutUrl', draftOrder.invoice_url, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }
  };

  const addProductBundle = async (offerId, bundle) => {
    // TODO
  };

  const replaceProduct = async (
    offerId,
    triggerShopifyProductId,
    shopifyProductId,
    shopifyVariantId
  ) => {
    const triggerShopifyCartItemIndex = shopifyCartItems.findIndex(
      (item) => item.product_id === triggerShopifyProductId
    );
    const triggerShopifyCartItem =
      shopifyCartItems[triggerShopifyCartItemIndex];
    const triggerShopifyVariantId = triggerShopifyCartItem?.variant_id;
    const nonTriggerShopifyCartItems = [
      ...shopifyCartItems.slice(0, triggerShopifyCartItemIndex),
      ...shopifyCartItems.slice(triggerShopifyCartItemIndex + 1)
    ];
    const quantity = triggerShopifyCartItem?.quantity;
    const draftOrderId = getCookie('upsellingDraftOrderId');
    let draftOrder = null;

    // Abort if trigger product was not found in cart.
    if (!triggerShopifyCartItem || triggerShopifyCartItemIndex === -1) {
      return;
    }

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );

    // Add the accepted variant to the Shopify cart (so that it shows on the Cart page).
    await replaceProductInShopifyCart(
      triggerShopifyVariantId,
      shopifyVariantId,
      quantity
    );

    if (draftOrderId) {
      // Remove the trigger product from draft order.
      await removeDraftOrderLineItem(draftOrderId, triggerShopifyVariantId);

      // Add the new variant to the existing draft order if one exists.
      await addProductToShopifyDraftOrder(draftOrderId, {
        offerId,
        shopifyVariantId,
        quantity
      });
    }

    // Create a new draft order if one does not exist.
    if (!draftOrderId) {
      // Create a new draft order. Include the offered item and items already in the cart.
      // Associate the new item with the offer.
      draftOrder = await createShopifyDraftOrder({
        lineItems: [
          {
            offerId,
            shopifyVariantId,
            quantity
          },
          ...nonTriggerShopifyCartItems.map((item) => ({
            shopifyVariantId: item.variant_id,
            quantity: item.quantity
          }))
        ]
      });

      // Track the draft order ID.
      setCookie('upsellingDraftOrderId', draftOrder.id, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the draft order checkout URL.
      setCookie('upsellingDraftOrderCheckoutUrl', draftOrder.invoice_url, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }
  };

  return { addProduct, addProductBundle, replaceProduct };
};

export default useOfferAcceptance;
