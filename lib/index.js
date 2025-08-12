const formatter = require('./helpers/formatter');

const { levels, validateConfig } = require('./config');

module.exports = (consoleInstance, config) => {
  const logger = {};
  const validatedConfig = validateConfig(config);
  if (consoleInstance.isProxied && validatedConfig.override) {
    consoleInstance.reset();
    console.warn('Already overridden, replacing logproxy');
  }
  const baseproxy = {};
  const logproxy = {};
  Object.keys(levels.consoleLevels).forEach((level) => {
    const org = consoleInstance[level];
    // proxy without handler this is the proxy we reset to as we can`t reset to native code
    baseproxy[level] = new Proxy(org, {});

    logproxy[level] = new Proxy(baseproxy[level], {
      apply(target, thisArg, args) {
        const newlog = formatter[validatedConfig.type](args, level);
        const minlevel = levels.consoleLevels[validatedConfig.level].level;

        if (validatedConfig.type === 'silent') return null;
        if (levels.consoleLevels[level].level > minlevel) return null;

        return target(...newlog);
      },
      get(obj, prop, ...arg) {
        if (prop === 'isProxy') {
          return true;
        }
        return Reflect.get(obj, prop, ...arg);
      },
    });
    if (validatedConfig.override) {
      consoleInstance[level] = logproxy[level];
    }
    logger[level] = logproxy[level];
  });

  consoleInstance.isProxied = true;
  consoleInstance.reset = () => {
    consoleInstance.isProxied = false;
    Object.keys(levels.consoleLevels).forEach((level) => {
      consoleInstance[level] = baseproxy[level];
      logger[level] = baseproxy[level];
    });
    return consoleInstance;
  };
  return logger;
};
