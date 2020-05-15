const mongoose = require('mongoose');
const Product = require('..');
const copy = require('./copy');
const removeCopiedProducts = require('./removeCopiedProducts');
const preValidateHook = require('./preValidateHook');

let ShopifyProduct = null;

const schema = mongoose.Schema({
  shopifyProductData: { type: mongoose.Schema.Types.Mixed, required: false }
});

schema.statics.removeCopiedProducts = function () {
  return removeCopiedProducts(this);
};

schema.methods.copy = function () {
  return copy(this);
};

schema.pre('validate', function (next) {
  preValidateHook(this, next);
});

ShopifyProduct = Product.discriminator('ShopifyProduct', schema);

module.exports = ShopifyProduct;
module.exports.schema = schema;
