const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const emailClient = require('@greatupsells/email-client');

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await emailClient.enqueue({
    to: contactEmail,
    from: `support@greatupsells.com`,
    subject: 'Test Email',
    body: `
      <p>This is a test email.</p>
    `
  });

  return {
    statusCode: StatusCodes.OK,
    body: ReasonPhrases.OK
  };
});

handler.use(cors());

module.exports.handler = handler;
