import ERC20 from '@universal-login/contracts/build/ERC20.json';
import {providers, utils, Contract} from 'ethers';
import {SignedMessage, ETHER_NATIVE_TOKEN, ensure, isContract, PaymentOptions} from '@universal-login/commons';
import IMessageValidator from '../../../core/models/IMessageValidator';
import {NotEnoughTokens, InvalidContract} from '../../../core/utils/errors';

export const hasEnoughToken = async ({gasToken, gasPrice, gasLimit}: PaymentOptions, walletContractAddress: string, provider: providers.Provider) => {
  if (gasToken === ETHER_NATIVE_TOKEN.address) {
    const walletBalance = await provider.getBalance(walletContractAddress);
    return walletBalance.gte(utils.bigNumberify(gasLimit).mul(gasPrice));
  } else {
    ensure(await isContract(provider, gasToken), InvalidContract, gasToken);
    const token = new Contract(gasToken, ERC20.interface, provider);
    const walletContractTokenBalance = await token.balanceOf(walletContractAddress);
    return walletContractTokenBalance.gte(utils.bigNumberify(gasLimit).mul(gasPrice));
  }
};

export default class EnoughTokenValidator implements IMessageValidator {
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
