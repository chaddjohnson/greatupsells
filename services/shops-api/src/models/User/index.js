const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');

let User = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    emailAddress: { type: String, required: true }
  },
  schemaOptions
);

schema.statics.findByEmailAddress = function (emailAddress) {
  return User.find({ emailAddress });
};
schema.index({ emailAddress: 1 });

User = mongodbClient.connection.model('User', schema);

module.exports = User;
