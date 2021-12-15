const { pick } = require('../helpers/pick');
const { fields } = require('./fields');
const levels = require('./levels');

const logformats = [
  'log',
  'json',
  'text',
];

const setBooleanValue = (value, defaultValue = false) => {
  if (value !== undefined) {
    if (value === 'true' || value === true) {
      return true;
    }
    if (value === 'false' || value === false) {
      return false;
    }
  }
  if (defaultValue === 'true' || defaultValue === true) {
    return true;
  }
  return false;
};

const validateConfig = (config) => {
  const filteredConfig = pick(config, ['type', 'override']);
  if (!filteredConfig.type || logformats.indexOf(filteredConfig.type) === -1) {
    filteredConfig.type = 'log';
  }
  filteredConfig.override = setBooleanValue(filteredConfig.override, false);
  return filteredConfig;
};

module.exports = {
  validateConfig,
  setBooleanValue,
  fields,
  levels,
};
