import ERC20 from '@universal-login/contracts/build/ERC20.json';
import {Wallet, providers, utils, Contract} from 'ethers';
import {SignedMessage, ETHER_NATIVE_TOKEN, ensure, isContractExist} from '@universal-login/commons';
import IMessageValidator from '../../../core/services/validators/IMessageValidator';
import {NotEnoughTokens, InvalidContract} from '../../../core/utils/errors';

const isContract = async (provider : providers.Provider, contractAddress : string) => {
  // TODO: Only whitelisted contracts
  const bytecode = await provider.getCode(contractAddress);
  return isContractExist(bytecode);
};

const hasEnoughToken = async (gasToken : string, walletContractAddress : string, gasLimit : utils.BigNumberish, provider : providers.Provider) => {
  // TODO: Only whitelisted tokens/contracts
  if (gasToken === ETHER_NATIVE_TOKEN.address) {
    const walletBalance = await provider.getBalance(walletContractAddress);
    return walletBalance.gte(utils.bigNumberify(gasLimit));
  } else if (!await isContract(provider, gasToken)) {
    throw new InvalidContract(gasToken);
  } else {
    const token = new Contract(gasToken, ERC20.interface, provider);
    const walletContractTokenBalance = await token.balanceOf(walletContractAddress);
    return walletContractTokenBalance.gte(utils.bigNumberify(gasLimit));
  }
};

export default class EnoughTokenValidator implements IMessageValidator {
  constructor(private wallet: Wallet) {}

  async validate(signedMessage: SignedMessage) {
    ensure(await hasEnoughToken(signedMessage.gasToken, signedMessage.from, signedMessage.gasLimitExecution, this.wallet.provider), NotEnoughTokens);
  }
}
