const crypto = require('crypto');

const hasRandomUUID = !!crypto.randomUUID;

function uuidV4() {
  if (hasRandomUUID) return crypto.randomUUID();
  /* istanbul ignore next */
  return '';
}

module.exports = {
  uuidV4,
};
