const crypto = require('crypto');

function uuidv4js() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      // eslint-disable-next-line no-bitwise
      const v = (c === 'x') ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
}

function uuidV4() {
  const hasRandomUUID = !!crypto.randomUUID;
  if (hasRandomUUID) return crypto.randomUUID();
  return uuidv4js();
}

module.exports = {
  uuidV4,
};
