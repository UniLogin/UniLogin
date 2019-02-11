const startDevelopment = require('./dev/startDevelopment');
const createEnv = require('./common/createEnv');
const spawnProcess = require('./common/spawnProcess');
const TokenGrantingRelayer = require('./dev/TokenGrantingRelayer');

module.exports = {startDevelopment, createEnv, spawnProcess, TokenGrantingRelayer};
