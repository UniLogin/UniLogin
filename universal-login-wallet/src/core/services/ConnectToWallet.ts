import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {Procedure, ApplicationWallet} from '@universal-login/commons';
import {utils} from 'ethers';

export interface Connection {
  unsubscribe: () => void;
  securityCode: number[];
}

const connectToWallet = (sdk: UniversalLoginSDK, walletService: WalletService) =>
  async (name: string, callback: Procedure): Promise<Connection> => {
    const contractAddress = await sdk.getWalletContractAddress(name);
    const {privateKey, securityCode} = await sdk.connect(contractAddress);

    const applicationWallet: ApplicationWallet = {privateKey, contractAddress, name};
    walletService.setApplicationWallet(applicationWallet);

    const filter = {
      contractAddress,
      key: utils.computeAddress(privateKey)
    };

    const subscription = sdk.subscribe('KeyAdded', filter, () => {
      walletService.connect(applicationWallet);
      subscription.remove();
      callback();
    });

    return {
      unsubscribe: () => subscription.remove(),
      securityCode
    };
  };
export default connectToWallet;
