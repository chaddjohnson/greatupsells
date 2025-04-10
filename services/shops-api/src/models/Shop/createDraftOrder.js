const buildDraftOrderLineItem = require('./buildDraftOrderLineItem');

const createDraftOrder = async (shop, data) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const lineItems = await Promise.all(data.lineItems.map(buildDraftOrderLineItem));
  const draftOrder = await shopifyApiClient.draftOrder.create({
    line_items: lineItems
  });

  return draftOrder;
};

module.exports = createDraftOrder;
