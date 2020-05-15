const httpStatus = require('http-status-codes');

const { AWS_REGION } = process.env;

module.exports.handler = async () => {
  return {
    statusCode: httpStatus.OK,
    body: AWS_REGION
  };
};
