const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Product = await models.get('Product');
  const Shop = await models.get('Shop');
  const shop = await Shop.findByDomain(domain);
  const shopifyProductId = data.id;
  let product = await Product.findByShopifyProductId(shopifyProductId);
  const dataIsNewer =
    !!product &&
    new Date(data.updated_at) > new Date(product.shopifyProductData.updated_at);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  if (!product) {
    try {
      product = await Product.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyProductId,
        shopifyProductData: data
      });
    } catch (error) {
      logger.error(
        `Error creating product for shop (${shop.toString()})`,
        error,
        data
      );
    }
  } else {
    try {
      if (dataIsNewer) {
        // Update local Shopify data for the product.
        product.shopifyProductData = data;

        await product.save();
      }
    } catch (error) {
      logger.error(
        `Error updating product (${product.toString()}) for shop (${shop.toString()})`,
        error,
        data
      );
    }
  }
};

module.exports = handler;
