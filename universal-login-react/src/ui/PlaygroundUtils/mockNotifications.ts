import UniLoginSdk from '@unilogin/sdk';
import {asMock} from '../../core/utils/asMock';

export const CONNECTION_REAL_ADDRESS = '0xee2C70026a0E36ccC7B9446b57BA2bD98c28930b'; // [ 28, 133, 989, 653, 813, 746 ]

const ATTACKER_ADDRESS_1_COMMON_CODE = [ //   \/ common prefix
  '0x49c9A6784C061D298f9021a07eC218382feE20A9', // [ 28, 166, 290, 921, 215, 752 ]
  '0xf247e3c2f118763f79BE7C226D1c3dB988004704', // [ 28, 400, 410, 709, 633, 236 ]
];

const ATTACKER_ADDRESS_NO_COMMON_CODE = [
  '0x9a2c510AA7E56B83AFe6834f83C24512bafD7318', // [ 815, 929, 749, 6, 64, 323 ]
  '0xC633cE261FfE65950ef74DDF05b8A953fAFfc095', // [ 846, 391, 428, 775, 549, 877 ]
];

const mockedNotifications = asMock<Notification[]>([
  {key: CONNECTION_REAL_ADDRESS},
  ...ATTACKER_ADDRESS_1_COMMON_CODE.map(address => ({key: address})),
  ...ATTACKER_ADDRESS_NO_COMMON_CODE.map(address => ({key: address})),
]);

export const mockNotifications = (sdk: UniLoginSdk) => {
  sdk.subscribeAuthorisations = async (walletContractAddress: string, privateKey: string, callback: Function) => {
    callback(mockedNotifications);
    return () => {};
  };
};
