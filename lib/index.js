const formatter = require('./helpers/formatter');
const { levels, validateConfig } = require('./config');

module.exports = (cons, config) => {
  const validatedConfig = validateConfig(config);
  Object.keys(levels.consoleLevels).forEach((level) => {
    const org = cons[level];
    // eslint-disable-next-line no-param-reassign
    cons[level] = new Proxy(org, {
      apply(target, thisArg, args) {
        const newlog = formatter[validatedConfig.type](args, level);
        return target(...newlog);
      },
    });
  });
};
