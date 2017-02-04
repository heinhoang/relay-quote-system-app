const babelRelayPlugin = require('babel-relay-plugin');
const schema = require('./cache/schema.json');

// Prepare for plugging into the Babel process
module.exports = babelRelayPlugin(schema.data);