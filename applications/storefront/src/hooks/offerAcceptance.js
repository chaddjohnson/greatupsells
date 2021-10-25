import { useCookies } from '@greatupsellsreact-hooks';
import useOfferTracking from './offerTracking';
import { useShopifyCart } from './shopifyCart';
import useShopifyDraftOrder from './shopifyDraftOrder';

const useOfferAcceptance = () => {
  const { getCookie, setCookie } = useCookies();
  const { trackOfferAcceptance } = useOfferTracking();
  const {
    shopifyCartItems,
    addVariantToShopifyCart,
    replaceVariantInShopifyCart
  } = useShopifyCart();
  const {
    createShopifyDraftOrder,
    addVariantToShopifyDraftOrder,
    removeShopifyDraftOrderVariant
  } = useShopifyDraftOrder();

  const addProduct = async (
    offerId,
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    let shopifyDraftOrderId = getCookie('greatupsellsDraftOrderId');
    let draftOrder = null;

    // Add the accepted variant to the Shopify cart (so that it shows on the Cart page).
    await addVariantToShopifyCart(shopifyVariantId, quantity);

    // Add the variant to the existing draft order if one exists.
    if (shopifyDraftOrderId) {
      await addVariantToShopifyDraftOrder(shopifyDraftOrderId, {
        offerId,
        shopifyVariantId,
        quantity
      });
    }

    // Create a new draft order if one does not exist.
    if (!shopifyDraftOrderId) {
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
      shopifyDraftOrderId = draftOrder.id;

      // Track the draft order ID.
      setCookie('greatupsellsDraftOrderId', draftOrder.id, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the draft order checkout URL.
      setCookie('greatupsellsDraftOrderCheckoutUrl', draftOrder.invoice_url, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      shopifyDraftOrderId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );
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
    let shopifyDraftOrderId = getCookie('greatupsellsDraftOrderId');
    let draftOrder = null;

    // Abort if trigger product was not found in cart.
    if (!triggerShopifyCartItem || triggerShopifyCartItemIndex === -1) {
      return;
    }

    // Add the accepted variant to the Shopify cart (so that it shows on the Cart page).
    await replaceVariantInShopifyCart(
      triggerShopifyVariantId,
      shopifyVariantId,
      quantity
    );

    if (shopifyDraftOrderId) {
      // Remove the trigger product from draft order.
      await removeShopifyDraftOrderVariant(
        shopifyDraftOrderId,
        triggerShopifyVariantId
      );

      // Add the new variant to the existing draft order if one exists.
      await addVariantToShopifyDraftOrder(shopifyDraftOrderId, {
        offerId,
        shopifyVariantId,
        quantity
      });
    }

    // Create a new draft order if one does not exist.
    if (!shopifyDraftOrderId) {
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
      shopifyDraftOrderId = draftOrder.id;

      // Track the draft order ID.
      setCookie('greatupsellsDraftOrderId', draftOrder.id, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the draft order checkout URL.
      setCookie('greatupsellsDraftOrderCheckoutUrl', draftOrder.invoice_url, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      shopifyDraftOrderId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );
  };

  return { addProduct, addProductBundle, replaceProduct };
};

export default useOfferAcceptance;
