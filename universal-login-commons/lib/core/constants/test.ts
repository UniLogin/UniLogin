import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from './constants';

export const TEST_ACCOUNT_ADDRESS = '0x0000000000000000000000000000000000000001';

export const TEST_CONTRACT_ADDRESS = '0xd9822CF2a4C3AccD2AF175A5dF0376D46Dcb848d';

export const TEST_PRIVATE_KEY = '0x63f01680950dc70f2eb8f373de0c360fcbb89ef437f2f6f2f0a1797979e490a4';

export const TEST_MESSAGE_HASH = '0xjfasd89yhfoi3hpuhfaif3hfasoihf89ph3faoihfouhsfkusahp8h3fa3ouhusd';

export const TEST_TRANSACTION_HASH = '0x9djflkdasjfijfiao73f46dbefoniasiofjiefh37ka3hdakdu378h2euh33jmvb';

export const TEST_SIGNATURE_KEY_PAIRS = [{
  key: '0xD1D84F0e28D6fedF03c73151f98dF95139700aa7',
  signature: '0x97a061e4965a13cda63e18cf4786ef174d04407dbede36982194b2316717afdd5737a0f24458f2798419dcbf6fc3198598c12693db80149ddc9846a7f17b747f1c'
}, {
  key: '0x8221157B2423906FFbb5FaF2A6B062C3d3A6050f',
  signature: '0xf65bc65a5043e6582b38aa2269bafd759fcdfe32a3640a3b2b9086260c5f090306bb9b821eb5e452748687c69b13f3cb67b74fb1f49b45fbe60b0c90b73a73651b'
}];

export const testJsonRpcUrl = 'http://localhost:8545';

export const TEST_GAS_PRICE = '1';

export const TEST_DEVICE_INFO = {
  os: 'Mac',
  name: 'laptop',
  city: 'Warsaw, Poland',
  ipAddress: '84.10.249.134',
  time: '18 minutes ago',
  browser: 'Safari'
};

export const TEST_TOKEN_DETAILS = [
  {
    address: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
    symbol: 'DAI',
    name: 'MockToken'
  },
  ETHER_NATIVE_TOKEN
];

export const TEST_GAS_MODES = [{
  name: 'cheap',
  gasOptions: [{
    gasPrice: utils.bigNumberify('20000000000'),
    token: TEST_TOKEN_DETAILS[0],
  },
  {
    gasPrice: utils.bigNumberify('20000000000'),
    token: TEST_TOKEN_DETAILS[1],
  }]
},
{
  name: 'fast',
  gasOptions: [{
    gasPrice: utils.bigNumberify('24000000000'),
    token: TEST_TOKEN_DETAILS[0],
  },
  {
    gasPrice: utils.bigNumberify('24000000000'),
    token: TEST_TOKEN_DETAILS[1],
  }]
}];
