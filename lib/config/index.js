const { pick } = require('../helpers/pick');
const { fields } = require('./fields');
const levels = require('./levels');

const logformats = [
  'log',
  'json',
  'text',
  'silent',
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
  const filteredConfig = pick(config, ['type', 'override', 'level']);
  if (!filteredConfig.type || logformats.indexOf(filteredConfig.type) === -1) {
    if (filteredConfig.type && logformats.indexOf(filteredConfig.type) === -1) {
      console.warn(`@digipolis/log: Unknown log type ${filteredConfig.type} fallback to log format`);
    }
    filteredConfig.type = 'log';
  }
  if (!filteredConfig.level || !levels.consoleLevels[filteredConfig.level]) {
    if (filteredConfig.level && !levels.consoleLevels[filteredConfig.level]) {
      console.warn(`@digipolis/log: Unknown level ${filteredConfig.level} fallback to debug`);
    }
    filteredConfig.level = 'debug';
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
