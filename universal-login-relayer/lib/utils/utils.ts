import {providers, utils, Contract, Wallet} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import ERC20 from '@universal-login/contracts/build/ERC20.json';
import {sleep, ETHER_NATIVE_TOKEN} from '@universal-login/commons';

const withENS = (provider : providers.Web3Provider, ensAddress : string) => {
  const chainOptions = {name: 'ganache', ensAddress, chainId: 0} as utils.Network;
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

const isContract = async (provider : providers.Provider, contractAddress : string) => {
  // TODO: Only whitelisted contracts
  const code = await provider.getCode(contractAddress);
  return !!code;
};

const hasEnoughToken = async (gasToken : string, walletContractAddress : string, gasLimit : utils.BigNumberish, provider : providers.Provider) => {
  // TODO: Only whitelisted tokens/contracts
  if (gasToken === ETHER_NATIVE_TOKEN.address) {
    const walletBalance = await provider.getBalance(walletContractAddress);
    return walletBalance.gte(utils.bigNumberify(gasLimit));
  } else if (!await isContract(provider, gasToken)) {
    throw new Error('Address is not a contract');
  } else {
    const token = new Contract(gasToken, ERC20.interface, provider);
    const walletContractTokenBalance = await token.balanceOf(walletContractAddress);
    return walletContractTokenBalance.gte(utils.bigNumberify(gasLimit));
  }
};

const isAddKeyCall = (data : string) => {
  const addKeySighash = new utils.Interface(WalletContract.interface).functions.addKey.sighash;
  return addKeySighash === data.slice(0, addKeySighash.length);
};

const getKeyFromData = (data : string) => {
  const codec = new utils.AbiCoder();
  const addKeySighash = new utils.Interface(WalletContract.interface).functions.addKey.sighash;
  const [address] = (codec.decode(['bytes32', 'uint256'], data.replace(addKeySighash.slice(2), '')));
  return utils.hexlify(utils.stripZeros(address));
};

const isAddKeysCall = (data : string) => {
  const addKeysSighash = new utils.Interface(WalletContract.interface).functions.addKeys.sighash;
  return addKeysSighash === data.slice(0, addKeysSighash.length);
};


const executionComparator = (execution1: any, execution2: any) =>  {
  const key1 = utils.bigNumberify(execution1.key);
  const key2 = utils.bigNumberify(execution2.key);
  if (key1.gt(key2)) {
    console.log('key1 > key2');
    return 1;
  } else if (key1.lt(key2)) {
    console.log('key1 < key2');
    return -1;
  } else {
    return 0;
  }
};

const sortExecutionsByKey = (executions: any) =>
    executions.sort(executionComparator);

const getRequiredSignatures = async (walletAddress: string, wallet: Wallet) => {
    const walletContract = new Contract(walletAddress, WalletContract.interface, wallet);
    const requiredSignatures = await walletContract.requiredSignatures();
    return requiredSignatures;
};

export {sleep, withENS, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall, sortExecutionsByKey, getRequiredSignatures, executionComparator};
