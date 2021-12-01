const consoleLevels = {
  error: {
    level: 0,
    name: 'error',
    logLevel: 'ERROR',
  },
  warn: {
    level: 1,
    name: 'warn',
    logLevel: 'WARN',
  },
  log: {
    level: 2,
    name: 'log',
    logLevel: 'INFO',
  },
  info: {
    level: 3,
    name: 'info',
    logLevel: 'INFO',
  },
  debug: {
    level: 4,
    name: 'debug',
    logLevel: 'DEBUG',
  },
};

const logLevels = {
  DEBUG: {
    consoleLevel: consoleLevels.debug,
    name: 'DEBUG',
  },
  INFO: {
    consoleLevel: consoleLevels.info,
    name: 'INFO',
  },
  WARN: {
    consoleLevel: consoleLevels.warn,
    name: 'WARN',
  },
  ERROR: {
    consoleLevel: consoleLevels.error,
    name: 'ERROR',
  },
  FATAL: {
    consoleLevel: consoleLevels.error,
    name: 'FATAL',
  },
  TRACE: {
    consoleLevel: consoleLevels.error,
    name: 'TRACE',
  },
};

module.exports = {
  consoleLevels,
  logLevels,
};
