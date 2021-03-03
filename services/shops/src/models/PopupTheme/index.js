const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');

let PopupTheme = null;

const schemaOptions = {
  timestamps: true,
  collection: 'popupThemes'
};
const themeVariablesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});
const formFieldsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'number', 'tel', 'checkbox', 'select']
  },
  options: [{ type: String, required: true }]
});
const schema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: false
    },
    displayOrder: { type: Int32, required: false },
    category: { type: String, required: true },
    thumbnailImageUrl: { type: String, required: true },
    description: { type: String, required: false },
    markup: { type: String, required: true },
    themeVariables: [themeVariablesSchema],
    formFields: [formFieldsSchema]
  },
  schemaOptions
);

schema.statics.findByShopId = function (shopId) {
  return PopupTheme.find({
    $or: [{ shop: null }, { shop: mongoose.Types.ObjectId(shopId) }]
  });
};

schema.index({ shop: 1 }, { sparse: true });
schema.index({ shop: 1, name: 1 }, { sparse: true, unique: true });

PopupTheme = mongodbClient.connection.model('PopupTheme', schema);

module.exports = PopupTheme;
