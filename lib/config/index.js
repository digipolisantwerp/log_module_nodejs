const { pick } = require('../helpers/pick');
const levels = require('./levels');

const logformats = [
  'log',
  'json',
  'text',
];

const validateConfig = (config) => {
  const filteredConfig = pick(config, ['type']);
  if (!filteredConfig.type || logformats.indexOf(filteredConfig.type) === -1) {
    filteredConfig.type = 'log';
  }
  return filteredConfig;
};

module.exports = {
  validateConfig,
  levels,
};
