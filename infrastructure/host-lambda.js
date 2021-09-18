// Reference: https://serverfault.com/a/888776/8431

exports.handler = async (event) => {
  // Extract the request object.
  const { request } = event.Records[0].cf;

  // Modify the host header to use the regional domain.
  request.headers.host[0].value = request.origin.custom.domainName;

  // Return control to CloudFront.
  return request;
};
