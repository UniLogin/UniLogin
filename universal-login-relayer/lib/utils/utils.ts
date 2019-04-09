import {providers, utils, Contract, ContractFactory, Wallet} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import ERC20 from '@universal-login/contracts/build/ERC20.json';
import defaultDeployOptions from '../config/defaultDeployOptions';
import fs from 'fs';
import {sleep, ETHER_NATIVE_TOKEN, ContractJSON} from '@universal-login/commons';
import {Arrayish, BigNumberish, Network} from 'ethers/utils';
import {TransactionRequest} from 'ethers/providers';

const {namehash} = utils;

const withENS = (provider : providers.Web3Provider, ensAddress : string) => {
  const chainOptions = {name: 'ganache', ensAddress, chainId: 0} as Network;
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

const isContract = async (provider : providers.Provider, contractAddress : string) => {
  // TODO: Only whitelisted contracts
  const code = await provider.getCode(contractAddress);
  return !!code;
};

const hasEnoughToken = async (gasToken : string, walletContractAddress : string, gasLimit : BigNumberish, provider : providers.Provider) => {
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

const sendAndWaitForTransaction = async (deployer : Wallet, transaction : TransactionRequest) => {
  const tx = await deployer.sendTransaction(transaction);
  const receipt = await deployer.provider.waitForTransaction(tx.hash!);
  return receipt.contractAddress;
};

const getDeployTransaction = (contractJSON : ContractJSON, args : string[] = []) => {
  const bytecode = `0x${contractJSON.bytecode}`;
  const abi = contractJSON.interface;
  const transaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(abi, bytecode).getDeployTransaction(...args),
  };
  return transaction;
};

const saveVariables = (filename : string, variables : Record<string, string>) => {
  const output = Object.entries(variables)
    .map(([key, value]) => `  ${key}='${value}'`)
    .join('\n');
  fs.writeFile(filename, output, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

export {sleep, sendAndWaitForTransaction, saveVariables, getDeployTransaction, withENS, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall};
