function getNodeUrl(nodeConfig) {
  return `http://${nodeConfig.address}:${nodeConfig.port}`;
}

module.exports = {getNodeUrl};
