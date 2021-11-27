const emailClient = require('@greatupsells/email-client');
const models = require('../models');

const { DOMAIN, LOGS_NOTIFICATION_EMAIL } = process.env;

const processRecord = async (record) => {
  const Log = await models.get('Log');

  // Parse the message.
  const { source, type, message, stackTrace, data } = JSON.parse(record.body);

  // Create log in MongoDB. Middleware will then create Elasticsearch document.
  await Log.create({ source, type, message, stackTrace, data });

  // Enqueue an email notification for error logs.
  if (type === 'ERROR') {
    await emailClient.enqueue({
      to: [LOGS_NOTIFICATION_EMAIL],
      from: `noreply@${DOMAIN}`,
      subject: `[${type}] - ${message}`,
      body: `${stackTrace}\n\n${JSON.stringify(data, null, 2)}`
    });
  }
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Using Promise.all() instead of Promise.allSettled() because batchSize is set to 1.
  // batchSize is set to 1 as messages should never be processed successfully more than once.
  await Promise.all(event.Records.map(processRecord));
};

module.exports.handler = handler;
