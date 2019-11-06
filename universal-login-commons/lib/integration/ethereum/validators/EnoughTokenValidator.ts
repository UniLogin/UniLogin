import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {providers, utils, Contract} from 'ethers';
import {ETHER_NATIVE_TOKEN, ensure, isContract, InvalidContract, IMessageValidator, PaymentOptions, SignedMessage, NotEnoughTokens} from '../../..';

export const hasEnoughToken = async ({gasToken, gasPrice, gasLimit}: PaymentOptions, walletContractAddress: string, provider: providers.Provider) => {
  if (gasToken === ETHER_NATIVE_TOKEN.address) {
    const walletBalance = await provider.getBalance(walletContractAddress);
    return walletBalance.gte(utils.bigNumberify(gasLimit).mul(gasPrice));
  } else {
    ensure(await isContract(provider, gasToken), InvalidContract, gasToken);
    const token = new Contract(gasToken, new utils.Interface(IERC20.abi), provider);
    const walletContractTokenBalance = await token.balanceOf(walletContractAddress);
    return walletContractTokenBalance.gte(utils.bigNumberify(gasLimit).mul(gasPrice));
  }
};

export class EnoughTokenValidator implements IMessageValidator {
  constructor(private provider: providers.Provider) {}

  async validate(signedMessage: SignedMessage) {
    const paymentOptions: PaymentOptions = {
      gasToken: signedMessage.gasToken,
      gasLimit: signedMessage.gasLimitExecution,
      gasPrice: signedMessage.gasPrice,
    };
    ensure(await hasEnoughToken(paymentOptions, signedMessage.from, this.provider), NotEnoughTokens);
  }
}
