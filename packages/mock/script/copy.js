const fs = require('fs-extra');
const path = require('path');

fs.copySync(
  path.join(__dirname, '../src/grpc/custom-data-template'),
  path.join(__dirname, '../lib/grpc/custom-data-template'),
);
console.log('copy src/grpc/custom-data-template to lib/grpc/custom-data-template success');
