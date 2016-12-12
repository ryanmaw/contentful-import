'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTransformedDestinationResponse;

var _collection = require('lodash/collection');

var _getOutdatedDestinationContent = require('contentful-batch-libs/get/get-outdated-destination-content');

var _getOutdatedDestinationContent2 = _interopRequireDefault(_getOutdatedDestinationContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the response from the destination space with the content that needs
 * to be updated. If it's the initial sync, and content exists, we abort
 * and tell the user why.
 */
function getTransformedDestinationResponse(_ref) {
  var managementClient = _ref.managementClient,
      spaceId = _ref.spaceId,
      sourceResponse = _ref.sourceResponse,
      skipContentModel = _ref.skipContentModel;

  return (0, _getOutdatedDestinationContent2.default)({
    managementClient: managementClient,
    spaceId: spaceId,
    entryIds: (0, _collection.map)(sourceResponse.entries, 'sys.id'),
    assetIds: (0, _collection.map)(sourceResponse.assets, 'sys.id')
  }).then(function (destinationResponse) {
    if (skipContentModel) {
      destinationResponse.contentTypes = [];
      destinationResponse.locales = [];
    }

    if (sourceResponse.isInitialSync && (destinationResponse.contentTypes.length > 0 || destinationResponse.assets.length > 0)) {
      throw new Error('Your destination space already has some content.\n' + 'If you have a token file, please place it on the same directory which you are currently in.\n' + 'Otherwise, please run this tool on an empty space.\n' + 'If you\'d like more information, please consult the README at:\n' + 'https://github.com/contentful/contentful-import');
    }
    return destinationResponse;
  });
}