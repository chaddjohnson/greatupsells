const fs = require('fs-extra');
const isLambda = require('is-lambda');

module.exports = async () => isLambda && fs.emptyDir('/tmp');
