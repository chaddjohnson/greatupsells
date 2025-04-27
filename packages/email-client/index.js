const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

const { EMAIL_QUEUE_URL, GSUITE_APP_PASSWORD } = process.env;

const enqueue = async ({ to, from, subject, body }) => {
  if (!EMAIL_QUEUE_URL) {
    return;
  }

  const sqs = new AWS.SQS();

  await sqs
    .sendMessage({
      QueueUrl: EMAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        to,
        from,
        subject,
        body
      })
    })
    .promise();
};

const send = async ({ from, to, subject = '', body = '' }) => {
  if (!from) {
    throw new Error('"from" required when sending email');
  }

  if (!to) {
    throw new Error('"to" is required');
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: from,
      pass: GSUITE_APP_PASSWORD // Use an App Password from Google if 2FA is enabled
    }
  });

  await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html: body
  });
};

module.exports = {
  enqueue,
  send
};
