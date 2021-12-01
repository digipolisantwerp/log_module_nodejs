const { pick, unpick } = require('./pick');
const { levels } = require('../config');

function json(args, level) {
  const newlog = args.reduce((acc, arg) => {
    let newAcc = { ...acc };
    if (typeof arg === 'object' && arg !== null) {
      const pickedArg = pick(arg, ['timestamp', 'correlationId']);
      newAcc = { ...newAcc, ...pickedArg };
      if ('type' in arg) {
        if (Array.isArray(arg.type)) {
          newAcc.type = arg.type;
        } else {
          newAcc.type = [arg.type];
        }
      }
      if ('message' in arg) {
        newAcc.message += arg.message;
      }
      if ('stack' in arg) {
        newAcc.message += ` ${arg.stack}`;
      }
      const unpicked = unpick(arg, ['type', 'timestamp', 'correlationId', 'message']);
      if (Object.keys(unpicked).length > 0) {
        newAcc.message += ` Extrainfo: ${JSON.stringify(unpicked)}`;
      }
    } else {
      newAcc.message += arg;
    }
    return newAcc;
  }, {
    message: '',
    timestamp: new Date().toISOString(),
    type: ['technical'],
    level: levels.consoleLevels[level].logLevel,
    correlationId: '',
  });

  return [newlog];
}

function log(args, level) {
  return [JSON.stringify(json(args, level)[0])];
}

function text(args, level) {
  args.unshift(new Date().toISOString());
  args.unshift(`${levels.consoleLevels[level].logLevel}:`);
  return args;
}

module.exports = {
  log,
  json,
  text,
};
