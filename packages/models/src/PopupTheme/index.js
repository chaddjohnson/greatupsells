const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');

let PopupTheme = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    callToActionTextColor: { type: String, required: true },
    successMessageTextColor: { type: String, required: true },
    successMessageBackgroundColor: { type: String, required: true },
    actionButtonBackgroundColor: { type: String, required: true },
    actionButtonTextColor: { type: String, required: true },
    actionButtonFontFamily: { type: String, required: true },
    cancelButtonTextColor: { type: String, required: true },
    priceTextColor: { type: String, required: true },
    salePriceTextColor: { type: String, required: true },
    popupBackgroundColor: { type: String, required: true },
    popupFontFamily: { type: String, required: true }
    // notificationBannerBackgroundColor: { type: String, required: true },
    // notificationBannerTextColor: { type: String, required: true }
  },
  schemaOptions
);

PopupTheme = mongodbClient.connection.model('PopupTheme', schema);

module.exports = PopupTheme;
