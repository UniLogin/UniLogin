import {config} from '@universal-login/relayer';

require('dotenv').config();

module.exports = Object.freeze({
  ...config,
  legacyENS: false,
  tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS,
  clickerContractAddress: process.env.CLICKER_CONTRACT_ADDRESS
});
