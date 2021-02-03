const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const calculate = require('./calculate');
const calculateToday = require('./calculateToday');
const calculateActiveShopCount = require('./calculateActiveShopCount');
const calculateGrossProfitChange = require('./calculateGrossProfitChange');
const calculateMonthlyGrossProfit = require('./calculateMonthlyGrossProfit');
const calculateShopInstallCount = require('./calculateShopInstallCount');
const calculateShopUninstallCount = require('./calculateShopUninstallCount');

let Stats = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    activeShopCount: { type: Int32, required: true },
    grossProfitChange: { type: Number, required: true },
    monthlyGrossProfit: { type: Number, required: true },
    shopInstallCount: { type: Int32, required: true },
    shopUninstallCount: { type: Int32, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
  },
  schemaOptions
);

schema.statics.calculate = function (startDate, endDate) {
  return calculate(startDate, endDate);
};

schema.statics.calculateToday = function () {
  return calculateToday();
};

schema.statics.calculateActiveShopCount = function () {
  return calculateActiveShopCount();
};

schema.statics.calculateGrossProfitChange = function (startDate, endDate) {
  return calculateGrossProfitChange(startDate, endDate);
};

schema.statics.calculateMonthlyGrossProfit = function (startDate, endDate) {
  return calculateMonthlyGrossProfit(startDate, endDate);
};

schema.statics.calculateShopInstallCount = function (startDate, endDate) {
  return calculateShopInstallCount(startDate, endDate);
};

schema.statics.calculateShopUninstallCount = function (startDate, endDate) {
  return calculateShopUninstallCount(startDate, endDate);
};

schema.index({ createdAt: -1 });

Stats = mongodbClient.connection.model('Stats', schema);

module.exports = Stats;
