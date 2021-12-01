const pick = (object, keys) => keys.reduce((obj, key) => {
  const newObj = { ...obj };
  if (object && key in object) {
    newObj[key] = object[key];
  }
  return newObj;
}, {});

const unpick = (object, keys) => keys.reduce((obj, key) => {
  const newObj = { ...obj };
  if (object && key in object) {
    delete newObj[key];
  }
  return newObj;
}, object);

module.exports = {
  pick,
  unpick,
};
