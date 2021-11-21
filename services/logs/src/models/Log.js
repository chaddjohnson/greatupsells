const mongoose = require('mongoose');
const mongodbClient = require('./mongodbClient');
const search = require('./search');
const hooks = require('./hooks');

let Log = null;

const schema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['INFO', 'WARN', 'ERROR']
  },
  message: { type: String, required: true, trim: true },
  stackTrace: { type: String, required: false, trim: true },
  data: { type: mongoose.Schema.Types.Mixed, required: false },
  createdAt: { type: Date, required: true, default: Date.now }
});

schema.statics.search = function (type, query, page, pageSize) {
  return search(type, query, page, pageSize);
};

schema.post('save', function (log, next) {
  hooks.postSave(log, next);
});

Log = mongodbClient.connection.model('Log', schema);

module.exports = Log;
