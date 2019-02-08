const startDevelopment = require('./src/dev/startDevelopment');
const createEnv = require('./src/common/createEnv');
const spawnProcess = require('./src/common/spawnProcess');
const TokenGrantingRelayer = require('./src/dev/TokenGrantingRelayer');

module.exports = {startDevelopment, createEnv, spawnProcess, TokenGrantingRelayer};
