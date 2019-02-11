import startDevelopment from './dev/startDevelopment';
import createEnv  from './common/createEnv';
import spawnProcess  from './common/spawnProcess';
import TokenGrantingRelayer  from './dev/TokenGrantingRelayer';
import Token from './contracts/Token.json';

module.exports = {startDevelopment, createEnv, spawnProcess, TokenGrantingRelayer, Token};
