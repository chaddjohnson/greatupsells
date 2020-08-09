const stringify = (params) => {
  if (typeof params !== 'object') {
    return '';
  }

  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export default { stringify };
