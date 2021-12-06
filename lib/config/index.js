const { pick } = require('../helpers/pick');
const levels = require('./levels');

const logformats = [
  'log',
  'json',
  'text',
];

const validateConfig = (config) => {
  const filteredConfig = pick(config, ['type', 'overide']);
  if (!filteredConfig.type || logformats.indexOf(filteredConfig.type) === -1) {
    filteredConfig.type = 'log';
  }
  if (filteredConfig.overide !== false) {
    filteredConfig.overide = true;
  }
  return filteredConfig;
};

module.exports = {
  validateConfig,
  levels,
};
