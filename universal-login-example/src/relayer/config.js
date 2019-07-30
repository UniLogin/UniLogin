import {getConfig} from '@universal-login/relayer';

module.exports = Object.freeze({
  ...getConfig('production'),
  tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS,
  clickerContractAddress: process.env.CLICKER_CONTRACT_ADDRESS
});
