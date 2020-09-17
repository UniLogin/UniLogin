import {utils, constants} from 'ethers';
import {ETHER_NATIVE_TOKEN} from './constants';
import {Network} from '../models/Network';
import {DeviceType} from '../models/notifications';
import {safeDivide} from '../utils/safeMultiply';
import {GasPriceSuggestion} from '../models/GasPriceSuggestion';
import {EncryptedWallet} from '../models/wallets/EncryptedWallet';

export const TEST_ACCOUNT_ADDRESS = '0x0000000000000000000000000000000000000001';

export const TEST_KEY = '0x5000000000000000000000000000000000000005';

export const TEST_KEY2 = '0x6000000000000000000000000000000000000006';

export const TEST_CONTRACT_ADDRESS = '0xd9822CF2a4C3AccD2AF175A5dF0376D46Dcb848d';

export const TEST_PRIVATE_KEY = '0x63f01680950dc70f2eb8f373de0c360fcbb89ef437f2f6f2f0a1797979e490a4';

export const TEST_ENS_NAME = 'name.mylogin.eth';

export const TEST_EMAIL = 'name@gmail.com';

export const TEST_MESSAGE_HASH = '0x06c81cd35a49c66824bc0b84bff850d1a2a56a09260c6fd332ee22a8b15fc9ca';

export const TEST_TRANSACTION_HASH = '0x06c81cd35a49c66824bc0b84bff850d1a2a56a09260c6fd332ee22a8b15fc9ca';

export const TEST_SIGNATURE_KEY_PAIRS = [{
  key: '0xD1D84F0e28D6fedF03c73151f98dF95139700aa7',
  signature: '0x97a061e4965a13cda63e18cf4786ef174d04407dbede36982194b2316717afdd5737a0f24458f2798419dcbf6fc3198598c12693db80149ddc9846a7f17b747f1c',
}, {
  key: '0x8221157B2423906FFbb5FaF2A6B062C3d3A6050f',
  signature: '0xf65bc65a5043e6582b38aa2269bafd759fcdfe32a3640a3b2b9086260c5f090306bb9b821eb5e452748687c69b13f3cb67b74fb1f49b45fbe60b0c90b73a73651b',
}];

export const testJsonRpcUrl = 'http://localhost:8545';

export const TEST_GAS_PRICE = utils.parseUnits('20', 'gwei').toString();

export const TEST_TOKEN_PRICE_IN_ETH = 0.005;

export const TEST_GAS_PRICE_IN_TOKEN = safeDivide(utils.bigNumberify(TEST_GAS_PRICE), TEST_TOKEN_PRICE_IN_ETH).toString();

export const TEST_GAS_LIMIT = 200000;

/*
Current ganache version will not revert with proper erros, unless gas is specifed.
*/
export const TEST_OVERRIDES_FOR_REVERT = {gasLimit: 1000000};

export const TEST_EXECUTION_OPTIONS = {gasPrice: TEST_GAS_PRICE, gasLimit: TEST_GAS_LIMIT, gasToken: constants.AddressZero};

export const TEST_APPLICATION_INFO = {
  applicationName: 'UniversalLogin',
  logo: 'logo',
  type: 'laptop' as DeviceType,
};

export const TEST_DEVICE_INFO = {
  ...TEST_APPLICATION_INFO,
  os: 'Mac',
  platform: 'laptop',
  city: 'Warsaw, Poland',
  ipAddress: '84.10.249.134',
  time: '18 minutes ago',
  browser: 'Safari',
};

export const TEST_TOKEN_ADDRESS = '0x490932174cc4B7a0f546924a070D151D156095f0';

export const TEST_SAI_TOKEN_ADDRESS = '0x05b954633faf5ceeecdf945c13ad825faabbf66f';

export const TEST_DAI_TOKEN = {
  address: TEST_TOKEN_ADDRESS,
  symbol: 'DAI',
  name: 'MockDAIToken',
  decimals: 18,
};

export const TEST_TOKEN_DETAILS = [
  TEST_DAI_TOKEN,
  {
    address: TEST_SAI_TOKEN_ADDRESS,
    symbol: 'SAI',
    name: 'MockSAIToken',
    decimals: 18,
  },
  ETHER_NATIVE_TOKEN,
];

export const TEST_GAS_MODES = [{
  name: 'cheap',
  usdAmount: '0.0000367702',
  timeEstimation: 114,
  gasOptions: [{
    gasPrice: utils.bigNumberify('20000000000'),
    token: TEST_TOKEN_DETAILS[0],
  },
  {
    gasPrice: utils.bigNumberify('20000000000'),
    token: TEST_TOKEN_DETAILS[1],
  },
  {
    gasPrice: utils.bigNumberify('20000000000'),
    token: TEST_TOKEN_DETAILS[2],
  }],
},
{
  name: 'fast',
  usdAmount: '0.00004412424',
  timeEstimation: 30,
  gasOptions: [{
    gasPrice: utils.bigNumberify(TEST_GAS_PRICE_IN_TOKEN),
    token: TEST_TOKEN_DETAILS[0],
  },
  {
    gasPrice: utils.bigNumberify(TEST_GAS_PRICE_IN_TOKEN),
    token: TEST_TOKEN_DETAILS[1],
  },
  {
    gasPrice: utils.bigNumberify('24000000000'),
    token: TEST_TOKEN_DETAILS[2],
  }],
}];

export const TEST_SDK_CONFIG = {
  network: 'ganache' as Network,
  authorizationsObserverTick: 3,
  priceObserverTick: 3,
  mineableFactoryTick: 3,
  mineableFactoryTimeout: 2000,
};

export const TEST_REFUND_PAYER = {
  name: 'Alex',
  apiKey: 'aaaa-bbbb-cccc',
};

export const TEST_GAS_PRICE_CHEAP = utils.parseUnits('16', 'gwei');

export const TEST_GAS_PRICES = {
  cheap: {
    gasPrice: TEST_GAS_PRICE_CHEAP,
    timeEstimation: '114',
  },
  fast: {
    gasPrice: utils.bigNumberify(TEST_GAS_PRICE),
    timeEstimation: '30',
  },
} as unknown as GasPriceSuggestion;

export const TEST_ENCRYPTED_WALLET_JSON: EncryptedWallet = {
  address: '76010666821749b24145d6d792a3038a6de0cd71',
  id: 'dc134bc2-9d47-4e73-990f-c9abeee94c41',
  version: 3,
  Crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: {iv: '7c4e7269f68a4b93337fd6f17d956735'},
    ciphertext: '6897e05bf1088a1e83b5c8ca3648b55cbc417661de660d2a30da65223b5f2fd0',
    kdf: 'scrypt',
    kdfparams: {
      salt: 'a8e44cd1357b86dcf387c29dd09f4f3b3d86ac6d411f3f88a069ef5f830b3c2e',
      n: 131072,
      dklen: 32,
      p: 1,
      r: 8,
    },
    mac: 'cc555dbde8816b36fbb4368fe3e9045c5a516a9028c51ada41860258b4da8ede',
  },
};

export const TEST_PASSWORD = 'testPassword';

export const TEST_WALLET = {
  encryptedWallet: TEST_ENCRYPTED_WALLET_JSON,
  password: TEST_PASSWORD,
  privateKey: '0xbaecec27b151e3aace7cdded79a95cef51a0586689d9e8ea1ce52d54a2c26acc',
  address: '0x76010666821749B24145D6d792a3038A6de0cD71',
};

export const TEST_STORED_FUTURE_WALLET = {
  contractAddress: TEST_CONTRACT_ADDRESS,
  publicKey: TEST_KEY,
  ensName: TEST_ENS_NAME,
  gasPrice: TEST_GAS_PRICE,
  gasToken: ETHER_NATIVE_TOKEN.address,
  tokenPriceInETH: '0.7',
};
