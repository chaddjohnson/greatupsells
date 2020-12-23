const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Product = await models.get('Product');
  const Shop = await models.get('Shop');
  const shop = await Shop.findByDomain(domain);
  const shopifyProductId = data.id;
  let product = await Product.findByShopifyProductId(shopifyProductId);
  const dataIsNewer =
    !product ||
    !product.shopifyProductData ||
    new Date(data.updated_at) > new Date(product.shopifyProductData.updated_at);

  if (!product) {
    try {
      product = await Product.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyProductId,
        shopifyProductData: data
      });

      logger.debug(`Product created (${product.toString()}) via webhook`, data);
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
        await product.execPopulate('shop');

        // Update local Shopify data for the product.
        product.shopifyProductData = data;

        await product.save();

        logger.debug(
          `Product updated (${product.toString()}) via webhook`,
          data
        );
      }
    } catch (error) {
      logger.error(
        `Error updating product (${product.toString()}) for shop (${shop.toString()})`,
        error,
        data
      );
    }
  }

  response.status(StatusCodes.OK).end();
};

module.exports = handler;
