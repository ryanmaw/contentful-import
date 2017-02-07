'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runContentfulImport;

var _collection = require('lodash/collection');

var _createClients = require('contentful-batch-libs/utils/create-clients');

var _createClients2 = _interopRequireDefault(_createClients);

var _pushToSpace = require('contentful-batch-libs/push/push-to-space');

var _pushToSpace2 = _interopRequireDefault(_pushToSpace);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _transformSpace = require('contentful-batch-libs/transform/transform-space');

var _transformSpace2 = _interopRequireDefault(_transformSpace);

var _getTransformedDestinationResponse = require('./get-transformed-destination-response');

var _getTransformedDestinationResponse2 = _interopRequireDefault(_getTransformedDestinationResponse);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runContentfulImport(usageParams) {
  var opts = usageParams.opts;

  if (!opts) {
    opts = {};
    opts.destinationSpace = usageParams.spaceId;
    opts.destinationManagementToken = usageParams.managementToken;
    opts.content = usageParams.content;
  }
  var clients = (0, _createClients2.default)(opts);
  opts.content.webhooks = opts.content.webhooks || [];
  return _bluebird2.default.props({
    source: opts.content,
    destination: (0, _getTransformedDestinationResponse2.default)({
      managementClient: clients.destination.management,
      spaceId: clients.destination.spaceId,
      sourceResponse: opts.content,
      skipLocales: opts.skipLocales,
      skipContentModel: opts.skipContentModel
    })
  }).then(function (responses) {
    return _bluebird2.default.props({
      source: (0, _transformSpace2.default)(responses.source, responses.destination),
      destination: responses.destination
    });
  }).then(function (responses) {
    responses.source.deletedContentTypes = (0, _collection.filter)(responses.destination.contentTypes, function (contentType) {
      return !(0, _collection.find)(responses.source.contentTypes, { original: { sys: { id: contentType.sys.id } } });
    });
    responses.source.deletedLocales = (0, _collection.filter)(responses.destination.locales, function (locale) {
      return !(0, _collection.find)(responses.source.locales, { original: { code: locale.code } });
    });
    return responses;
  })
  // push source space content to destination space
  .then(function (responses) {
    return (0, _pushToSpace2.default)({
      sourceContent: responses.source,
      destinationContent: responses.destination,
      managementClient: clients.destination.management,
      spaceId: clients.destination.spaceId,
      prePublishDelay: opts.prePublishDelay,
      assetProcessDelay: opts.assetProcessDelay,
      contentModelOnly: opts.contentModelOnly,
      skipLocales: opts.skipLocales,
      skipContentModel: opts.skipContentModel
    }).then(function (responses) {
      _npmlog2.default.info('Successfully Imported all data');
      return true;
    });
  }).catch(function (err) {
    _npmlog2.default.error(err);
    throw err;
  });
}