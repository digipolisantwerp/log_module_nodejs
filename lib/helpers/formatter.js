const { pick, unpick } = require('./pick');
const { levels, fields } = require('../config');
const uuidhelper = require('./uuid');

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (Buffer.isBuffer(value) || value.type === 'Buffer') {
        return '[Buffer]';
      }
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
};

function json(args, level) {
  const newlog = args.reduce((acc, arg) => {
    let newAcc = { ...acc };
    if (typeof arg === 'object' && arg !== null) {
      const pickedArg = pick(arg, fields);
      newAcc = { ...newAcc, ...pickedArg };
      if ('type' in arg) {
        if (Array.isArray(arg.type)) {
          newAcc.type = arg.type;
        } else {
          newAcc.type = [arg.type];
        }
      }
      if (!newAcc.message && ('message' in arg || 'stack' in arg)) {
        newAcc.message = '';
      }
      if (newAcc.message && ('message' in arg || 'stack' in arg)) {
        newAcc.message += ' ';
      }
      if ('message' in arg) {
        newAcc.message += arg.message;
      }
      if ('stack' in arg) {
        newAcc.message += ` ${arg.stack}`;
      }
      const unpicked = unpick(arg, [...fields, 'type', 'level', 'message']);
      if (Object.keys(unpicked).length > 0) {
        newAcc.message += ` Extrainfo: ${JSON.stringify(unpicked, getCircularReplacer())}`;
      }
    } else {
      if (!newAcc.message) {
        newAcc.message = '';
      } else {
        newAcc.message += ' ';
      }
      newAcc.message += arg;
    }
    return newAcc;
  }, {
    timestamp: new Date().toISOString(),
    type: ['technical'],
    level: levels.consoleLevels[level].logLevel,
    correlationId: uuidhelper.uuidV4(),
  });

  return [newlog];
}

function log(args, level) {
  return [JSON.stringify(json(args, level)[0], getCircularReplacer())];
}

function silent(args) {
  return args;
}

function text(args, level) {
  args.unshift(new Date().toISOString());
  args.unshift(`${levels.consoleLevels[level].logLevel}:`);
  return args;
}

module.exports = {
  json,
  log,
  silent,
  text,
};
