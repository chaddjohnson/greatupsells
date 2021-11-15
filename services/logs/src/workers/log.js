const models = require('../models');

const processRecord = async (record) => {
  const Log = await models.get('Log');

  // Parse the message.
  const { source, type, message, stackTrace, data } = JSON.parse(record.body);

  // Create log in MongoDB. Middleware will then create Elasticsearch document.
  await Log.create({ source, type, message, stackTrace, data });

  // Enqueue an email notification for error logs.
  if (type === 'ERROR') {
    // TODO
  }
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await Promise.all(event.Records.map(processRecord));
};

module.exports.handler = handler;
