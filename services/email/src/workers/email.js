const emailClient = require('@greatupsells/email-client');
const logger = require('@greatupsells/logger');

const processRecord = async (record) => {
  // Parse the message.
  const { to, from, subject, body } = JSON.parse(record.body);

  try {
    await emailClient.send({ to, from, subject, body });
  } catch (error) {
    await logger.warn(`Failed to send email to "${to}"`, error, {
      to,
      from,
      subject,
      body
    });
    throw error;
  }
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const results = await Promise.allSettled(event.Records.map(processRecord));
  const anyFailed = results.some(({ status }) => status === 'rejected');

  if (anyFailed) {
    throw new Error('Failed to process one or more records');
  }
};

module.exports.handler = handler;
