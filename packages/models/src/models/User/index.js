const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

require('mongoose-long')(mongoose);

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

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
