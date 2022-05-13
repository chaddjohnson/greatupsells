const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const clone = require('./clone');
const hooks = require('./hooks');

let Theme = null;

const schemaOptions = {
  timestamps: true,
  collection: 'themes'
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
  options: { type: mongoose.Schema.Types.Mixed, required: false }
});
const schema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: false
    },
    displayOrder: { type: Int32, required: false },
    strategies: [
      {
        type: String,
        required: true,
        enum: [
          'UPSELL',
          'CROSS_SELL',
          'POST_CHECKOUT',
          'THANK_YOU_PAGE',
          'POPUP'
        ]
      }
    ],
    categories: [{ type: String, required: true, trim: true }],
    thumbnailImageUrl: { type: String, required: true },
    description: { type: String, required: false },
    variables: [variablesSchema],
    formFields: [formFieldsSchema],
    maximumOfferedProductQuantity: { type: Number, required: true, min: 1 },
    referenceUrl: { type: String, required: false },
    notes: { type: String, required: false },
    enabled: { type: Boolean, required: true, default: false }
  },
  schemaOptions
);

schema.statics.findByOfferId = function (offerId) {
  return Theme.find({ offer: mongoose.Types.ObjectId(offerId) });
};

schema.methods.clone = function () {
  return clone(this);
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

schema.index({ offer: 1 }, { sparse: true });

Theme = mongodbClient.connection.model('Theme', schema);

module.exports = Theme;
