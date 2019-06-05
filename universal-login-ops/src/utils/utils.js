function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {deepCopy};
