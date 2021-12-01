const { pick, unpick } = require('./pick');
const { levels } = require('../config');

function json(args, level) {
  const newlog = args.reduce((acc, arg) => {
    let newAcc = { ...acc };
    if (typeof arg === 'object' && arg !== null) {
      const pickedArg = pick(arg, ['type', 'timestamp', 'correlationId']);
      // console.log('pickedArg', JSON.stringify(pickedArg, null, 2));
      newAcc = { ...newAcc, ...pickedArg };
      // console.log('newAcc', JSON.stringify(newAcc, null, 2));
      if ('message' in arg) {
        newAcc.message += arg.message;
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
