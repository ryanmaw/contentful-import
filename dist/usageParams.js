'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _package = require('../package');

var packageFile = _interopRequireWildcard(_package);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var opts = _yargs2.default.version(packageFile.version || 'Version only available on installed package').usage('Usage: $0 [options]').option('space-id', {
  describe: 'ID of the destination space',
  type: 'string',
  demand: true
}).option('management-token', {
  describe: 'Management API token for the destination space',
  type: 'string',
  demand: true
}).option('content-file', {
  describe: 'json file that contains data to be import to your space',
  type: 'string',
  demand: true
}).option('skip-content-model', {
  describe: 'Skips content types and locales. Copies only entries and assets',
  type: 'boolean'
}).option('skip-locales', {
  describe: 'Skips locales. Must be used with content-model-only. Copies only content-types',
  type: 'boolean'
}).config('config', 'Configuration file with required values').check(function (argv) {
  if (!argv.spaceId) {
    _npmlog2.default.error('Please provide --space-id to be used to import \n' + 'For more info See: https://www.npmjs.com/package/contentful-import');
    process.exit(1);
  }
  if (!argv.managementToken) {
    _npmlog2.default.error('Please provide --management-token to be used for import \n' + 'For more info See: https://www.npmjs.com/package/contentful-import');
    process.exit(1);
  }
  if (!argv.contentFile) {
    _npmlog2.default.error('Please provide --content-file to be used for import \n' + 'For more info See: https://www.npmjs.com/package/contentful-import');
    process.exit(1);
  }
  return true;
}).argv;

opts.content = opts.content || JSON.parse(_fs2.default.readFileSync(opts.contentFile));
opts.destinationSpace = opts.destinationSpace || opts.spaceId;
opts.destinationManagementToken = opts.destinationManagementToken || opts.managementToken;
opts.exportDir = opts.exportDir || process.cwd();

module.exports = {
  opts: opts,
  errorLogFile: opts.exportDir + '/contentful-import-' + Date.now() + '.log'
};