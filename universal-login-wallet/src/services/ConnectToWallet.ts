import UniversalLoginSDK from 'universal-login-sdk';
import {Procedure} from 'universal-login-commons';
import {Wallet} from 'ethers';

const connectToWallet = (sdk: UniversalLoginSDK, walletService: any) => async (name: string, callback: Procedure) => {
  const contractAddress = await sdk.getWalletContractAddress(name);
  const privateKey = await sdk.connect(contractAddress);
  const publicKey = (new Wallet(privateKey)).address;
  walletService.userWallet = {privateKey, contractAddress, name};
  const filter = {contractAddress, key: publicKey};
  const subscription = sdk.subscribe('KeyAdded', filter, callback);
  return () => subscription.remove();
};
export default connectToWallet;
