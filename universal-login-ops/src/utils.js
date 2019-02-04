function getNodeUrl(nodeConfig) {
  return `http://${nodeConfig.address}:${nodeConfig.port}`;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {getNodeUrl, deepCopy};
