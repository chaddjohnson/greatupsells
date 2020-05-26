// TODO: Use bunyan? Use winston?

const formatErrorData = (error) => {
  if (!(error instanceof Error)) {
    return error;
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

const formatObjectData = (string) => {
  if (typeof string === 'object') {
    return JSON.stringify(string, null, 2);
  }

  return string;
};

const format = (data) =>
  data
    .reduce(
      (string, item) =>
        `${string}${formatErrorData(item)}${formatObjectData(item)}\n\n`,
      ''
    )
    .trim();

const debug = (message, ...data) => {
  console.debug(message, format(data));
  // TODO
};

const info = (message, ...data) => {
  console.info(message, format(data));
  // TODO
};

const warn = (message, ...data) => {
  console.warn(message, format(data));
  // TODO
};

const error = (message, ...data) => {
  console.error(message, format(data));
  // TODO
};

module.exports = {
  debug,
  info,
  warn,
  error
};
