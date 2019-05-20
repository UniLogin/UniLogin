import ERC20 from '@universal-login/contracts/build/ERC20.json';
import {utils, providers, Contract} from 'ethers';
import {SignedMessage, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {InvalidContract, NotEnoughTokens, NotEnoughGas} from '../../utils/errors';

const isContract = async (provider : providers.Provider, contractAddress : string) => {
  // TODO: Only whitelisted contracts
  const code = await provider.getCode(contractAddress);
  return !!code;
};

export const hasEnoughToken = async (gasToken : string, walletContractAddress : string, gasLimit : utils.BigNumberish, provider : providers.Provider) => {
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

export const ensureEnoughToken = async (provider: providers.Provider, message: SignedMessage) => {
  if (!await hasEnoughToken(message.gasToken, message.from, message.gasLimit, provider)) {
    throw new NotEnoughTokens();
  }
};

export const ensureEnoughGas = async (provider: providers.Provider, walletAddress: string, transaction: providers.TransactionRequest, message: SignedMessage) => {
  const estimateGas = await provider.estimateGas({ ...transaction, from: walletAddress });
  if (!utils.bigNumberify(message.gasLimit as utils.BigNumberish).gte(estimateGas)) {
    throw new NotEnoughGas();
  }
};

