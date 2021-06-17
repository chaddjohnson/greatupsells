import { useCookies } from '@neatowebsolutions/upselling-react-hooks';
import useOfferTracking from './offerTracking';
import useShopifyCart from './shopifyCart';
import useShopifyDraftOrder from './shopifyDraftOrder';

const useOfferAcceptance = () => {
  const { getCookie, setCookie } = useCookies();
  const { trackOfferAcceptance } = useOfferTracking();
  const { shopifyCartItems } = useShopifyCart();
  const {
    createShopifyDraftOrder,
    addProductToShopifyDraftOrder
  } = useShopifyDraftOrder();

  const handleAddProduct = async (
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

    // Add the variant to the existing draft order if one exists.
    if (shopifyVariantId && draftOrderId) {
      await addProductToShopifyDraftOrder(draftOrderId, {
        offerId,
        shopifyVariantId,
        quantity
      });
    }

    // Create a new draft order if one does not exist.
    if (shopifyVariantId && !draftOrderId) {
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
      setCookie('upsellingDraftOrderUrl', draftOrder.invoice_url, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });
    }
  };

  return { handleAddProduct };
};

export default useOfferAcceptance;
