import {defaultAccounts} from 'ethereum-waffle';

module.exports = Object.freeze({
  jsonRpcUrl: 'http://localhost:18545',
  privateKey: defaultAccounts[0].secretKey
});
