const formatter = require('./helpers/formatter');

const { levels, validateConfig } = require('./config');

module.exports = (cons, config) => {
  const logger = {};
  const validatedConfig = validateConfig(config);
  if (cons.isProxied && validatedConfig.override) {
    cons.reset();
    console.warn('Already overridden, replacing logproxy');
  }
  const baseproxy = {};
  const logproxy = {};
  Object.keys(levels.consoleLevels).forEach((level) => {
    const org = cons[level];
    // proxy without handler this is the proxy we reset to as we can`t reset to native code
    baseproxy[level] = new Proxy(org, {});

    logproxy[level] = new Proxy(baseproxy[level], {
      apply(target, thisArg, args) {
        const newlog = formatter[validatedConfig.type](args, level);
        if (validatedConfig.type === 'silent') {
          return null;
        }
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
      cons[level] = logproxy[level];
    }
    logger[level] = logproxy[level];
  });

  cons.isProxied = true;
  cons.reset = () => {
    cons.isProxied = false;
    Object.keys(levels.consoleLevels).forEach((level) => {
      cons[level] = baseproxy[level];
      logger[level] = baseproxy[level];
    });
    return cons;
  };
  return logger;
};
