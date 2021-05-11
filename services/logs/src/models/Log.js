const mongoose = require('mongoose');
const mongodbClient = require('./mongodbClient');

let Log = null;

const schema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['INFO', 'WARN', 'ERROR'],
    trim: true
  },
  message: { type: String, required: true, trim: true },
  data: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now }
});

schema.pre('validate', function (next) {
  this.data = this.data.toString();
  next();
});

Log = mongodbClient.connection.model('Log', schema);

module.exports = Log;
