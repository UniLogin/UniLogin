import UniversalLoginSDK, { WalletService } from '@universal-login/sdk';
import {Procedure} from '@universal-login/commons';
import {Wallet} from 'ethers';
import { WalletStorageService } from './WalletStorageService';

interface Connection {
  unsubscribe: () => void;
  securityCode: number[];
}

const connectToWallet = (sdk: UniversalLoginSDK, walletService: WalletService, walletStorageService: WalletStorageService) =>
  async (name: string, callback: Procedure): Promise<Connection> => {
  const contractAddress = await sdk.getWalletContractAddress(name);
  const {privateKey, securityCode} = await sdk.connect(contractAddress);
  const publicKey = (new Wallet(privateKey)).address;
  walletService.connect({privateKey, contractAddress, name});
  walletStorageService.save();
  const filter = {contractAddress, key: publicKey};
  const subscription = sdk.subscribe('KeyAdded', filter, () => {
    subscription.remove();
    callback();
  });
  return {
    unsubscribe: () => subscription.remove(),
    securityCode
  };
};
export default connectToWallet;
