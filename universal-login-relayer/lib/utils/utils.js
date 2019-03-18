import {providers, utils, Contract, ContractFactory} from 'ethers';
import ENS from 'universal-login-contracts/build/ENS';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import WalletContract from 'universal-login-contracts/build/WalletContract';
import ERC20 from 'universal-login-contracts/build/ERC20';
import defaultDeployOptions from '../config/defaultDeployOptions';
import fs from 'fs';
import * as migrationListResolver from 'knex/lib/migrate/migration-list-resolver';
import {sleep, ETHER_NATIVE_TOKEN} from 'universal-login-commons';

const {namehash} = utils;

const messageSignatureForApprovals = (wallet, id) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['uint256'],
      [id]),
    ));

const withENS = (provider, ensAddress) => {
  const chainOptions = {ensAddress, chainId: 0};
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

export const isContract = async (provider, contractAddress) => {
  // TODO: Only whitelisted contracts
  const code = await provider.getCode(contractAddress);
  return !!code;
};

const hasEnoughToken = async (gasToken, identityAddress, gasLimit, provider) => {
  // TODO: Only whitelisted tokens/contracts
  if (gasToken === ETHER_NATIVE_TOKEN.address) {
    const walletBalance = await provider.getBalance(identityAddress);
    return walletBalance.gte(utils.bigNumberify(gasLimit));
  } else if (!await isContract(provider, gasToken)) {
    throw new Error('Address is not a contract');
  } else {
    const token = new Contract(gasToken, ERC20.interface, provider);
    const identityTokenBalance = await token.balanceOf(identityAddress);
    return identityTokenBalance.gte(utils.bigNumberify(gasLimit));
  }
};

const lookupAddress = async (provider, address) => {
  const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
  const ens = new Contract(provider.ensAddress, ENS.interface, provider);
  const resolver = await ens.resolver(node);
  const contract = new Contract(resolver, PublicResolver.interface, provider);
  return contract.name(node);
};

const isAddKeyCall = (data) => {
  const addKeySighash = new utils.Interface(WalletContract.interface).functions.addKey.sighash;
  return addKeySighash === data.slice(0, addKeySighash.length);
};

const getKeyFromData = (data) => {
  const codec = new utils.AbiCoder();
  const addKeySighash = new utils.Interface(WalletContract.interface).functions.addKey.sighash;
  const [address] = (codec.decode(['bytes32', 'uint256'], data.replace(addKeySighash.slice(2), '')));
  return utils.hexlify(utils.stripZeros(address));
};

const isAddKeysCall = (data) => {
  const addKeysSighash = new utils.Interface(WalletContract.interface).functions.addKeys.sighash;
  return addKeysSighash === data.slice(0, addKeysSighash.length);
};

const sendAndWaitForTransaction = async (deployer, transaction) => {
  const tx = await deployer.sendTransaction(transaction);
  const receipt = await deployer.provider.waitForTransaction(tx.hash);
  return receipt.contractAddress;
};

const getDeployTransaction = (contractJSON, args = '') => {
  const bytecode = `0x${contractJSON.bytecode}`;
  const abi = contractJSON.interface;
  const transaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(abi, bytecode).getDeployTransaction(...args),
  };
  return transaction;
};

const saveVariables = (filename, variables) => {
  const output = Object.entries(variables)
    .map(([key, value]) => `  ${key}='${value}'`)
    .join('\n');
  fs.writeFile(filename, output, (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

export {sleep, sendAndWaitForTransaction, saveVariables, getDeployTransaction, messageSignatureForApprovals, withENS, lookupAddress, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall};
