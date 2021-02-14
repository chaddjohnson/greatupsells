const AWS = require('aws-sdk');

// TODO: Use bunyan? Use winston?

const { LOG_QUEUE_URL, LOG_SOURCE } = process.env;

const formatErrorData = (error) => {
  if (!(error instanceof Error)) {
    return '';
  }

  // Include stack trace.
  let string = `${error.stack}\n\n`;

  // Include validation errors.
  if (error.errors) {
    string += `${JSON.stringify(error.errors, null, 2)}\n\n`;
  }

  // Include request errors.
  if (error.response && error.response.body) {
    string += JSON.stringify(error.response.body, null, 2);
  }

  return string.trim();
};

const formatObjectData = (data) => {
  if (typeof data === 'object') {
    if (data.toObject) {
      // For easy compatibility with Mongoose.
      return JSON.stringify(data.toObject(), null, 2);
    } else {
      return JSON.stringify(data, null, 2);
    }
  }

  return data || '';
};

const format = (data) =>
  data
    .reduce(
      (string, item) =>
        `${string}\n${formatErrorData(item)}\n${formatObjectData(item)}\n\n`,
      ''
    )
    .trim();

const sendMessage = async (type, message, data) => {
  const source = LOG_SOURCE;

  try {
    const sqs = new AWS.SQS();
    const body = { source, type, message, data };

    if (LOG_QUEUE_URL) {
      await sqs
        .sendMessage({
          QueueUrl: LOG_QUEUE_URL,
          MessageBody: JSON.stringify(body)
        })
        .promise();
    }
  } catch (error) {
    console.error(
      `Unable to log ${source} message "${message}": ${error.message}`
    );
  }
};

const debug = async (message, ...data) => {
  const formattedData = format(data);

  console.debug(message);
  console.debug(formattedData);
};

const info = async (message, ...data) => {
  const formattedData = format(data);

  console.info(message);
  console.info(formattedData);
  await sendMessage('info', message, data);
};

const warn = async (message, ...data) => {
  const formattedData = format(data);

  console.warn(message);
  console.warn(formattedData);
  await sendMessage('warn', message, data);
};

const error = async (message, ...data) => {
  const formattedData = format(data);

  console.error(message);
  console.error(formattedData);
  await sendMessage('error', message, data);
};

module.exports = {
  debug,
  info,
  warn,
  error
};
