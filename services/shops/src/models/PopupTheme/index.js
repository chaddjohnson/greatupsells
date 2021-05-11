const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const hooks = require('./hooks');

let PopupTheme = null;

const schemaOptions = {
  timestamps: true,
  collection: 'popupThemes'
};
const variablesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['TEXT', 'COLOR', 'FONT', 'FONTSIZE', 'OPTION']
  },
  group: { type: String, required: false },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  options: { type: mongoose.Schema.Types.Mixed, required: false }
});
const formFieldsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['TEXT', 'EMAIL', 'NUMBER', 'TEL', 'CHECKBOX', 'SELECT']
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
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: false
    },
    displayOrder: { type: Int32, required: false },
    strategy: {
      type: String,
      required: true,
      enum: ['UPSELL', 'CROSS_SELL', 'POPUP']
    },
    category: { type: String, required: true },
    thumbnailImageUrl: { type: String, required: true },
    description: { type: String, required: false },
    template: { type: String, required: true },
    variables: [variablesSchema],
    formFields: [formFieldsSchema]
  },
  schemaOptions
);

schema.statics.findByOfferId = function (offerId) {
  return PopupTheme.find({ offer: mongoose.Types.ObjectId(offerId) });
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

schema.index({ shop: 1 }, { sparse: true });
schema.index({ offer: 1 }, { sparse: true });

PopupTheme = mongodbClient.connection.model('PopupTheme', schema);

module.exports = PopupTheme;
