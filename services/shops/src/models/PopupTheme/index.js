const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');

let PopupTheme = null;

const schemaOptions = {
  timestamps: true,
  collection: 'popupThemes'
};
const variableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
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
    markup: { type: String, required: true },
    themeVariables: [variableSchema],
    inputVariables: [variableSchema]
  },
  schemaOptions
);

schema.index({ shop: 1 }, { sparse: true });
schema.index({ shop: 1, name: 1 }, { sparse: true, unique: true });

PopupTheme = mongodbClient.connection.model('PopupTheme', schema);

module.exports = PopupTheme;
