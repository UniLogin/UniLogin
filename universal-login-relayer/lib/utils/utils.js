import {providers, utils, Contract, ContractFactory} from 'ethers';
import ENS from 'universal-login-contracts/build/ENS';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import ERC20 from 'universal-login-contracts/build/ERC20';
import Identity from 'universal-login-contracts/build/Identity';
import defaultDeployOptions from '../../lib/config/defaultDeployOptions';
import fs from 'fs';

const {namehash} = utils;

const ether = '0x0000000000000000000000000000000000000000';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitForContractDeploy = async (providerOrWallet, contractJSON, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  const abi = contractJSON.interface;
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt) {
    await sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return new Contract(receipt.contractAddress, abi, providerOrWallet);
};

const messageSignatureForApprovals = (wallet, id) =>
  wallet.signMessage(
    utils.arrayify(utils.solidityKeccak256(
      ['uint256'],
      [id])
    ));

const withENS = (provider, ensAddress) => {
  const chainOptions = {ensAddress, chainId: 0};
  // eslint-disable-next-line no-underscore-dangle
  return new providers.Web3Provider(provider._web3Provider, chainOptions);
};

const hasEnoughToken = async (gasToken, identityAddress, gasLimit, provider) => {
  // TODO what if passed address is not a for a token address
  const erc20Bytecode = '0x6080604052600436106100b95763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630';
  if (gasToken === ether) {
    throw new Error('Ether refunds are not yet supported');
  } else if ((await provider.getCode(gasToken)).slice(2, 111) !== erc20Bytecode.slice(2, 111)) {
    throw new Error('Address isn`t token');
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
  return await contract.name(node);
};

const isAddKeyCall = (data) => {
  const addKeySighash = new utils.Interface(Identity.interface).functions.addKey.sighash;
  return addKeySighash === data.slice(0, addKeySighash.length);
};

const getKeyFromData = (data) => {
  const codec = new utils.AbiCoder();
  const addKeySighash = new utils.Interface(Identity.interface).functions.addKey.sighash;
  const [address] = (codec.decode(['bytes32', 'uint256', 'uint256'], data.replace(addKeySighash.slice(2), '')));
  return utils.hexlify(utils.stripZeros(address));
};

const isAddKeysCall = (data) => {
  const addKeysSighash = new utils.Interface(Identity.interface).functions.addKeys.sighash;
  return addKeysSighash === data.slice(0, addKeysSighash.length);
};

const sendAndWaitForTransaction = async (deployer, transaction) => {
  const tx = await deployer.sendTransaction(transaction);
  let receipt = await deployer.provider.getTransactionReceipt(tx.hash);
  while (!receipt || !receipt.blockNumber) {
    await sleep(1000);
    receipt = await deployer.provider.getTransactionReceipt(tx.hash);
  }
  return receipt.contractAddress;
};

const getDeployTransaction = (contractJSON, args = '') => {
  const bytecode = `0x${contractJSON.bytecode}`;
  const abi = contractJSON.interface;
  const transaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(abi, bytecode).getDeployTransaction(...args)
  };
  return transaction;
};

const waitToBeMined = async (provider, transaction, timeout = 1000) => {    
  let receipt = await provider.getTransactionReceipt(transaction.hash);
  while (!receipt || !receipt.blockNumber) {
    await sleep(timeout);
    receipt = await provider.getTransactionReceipt(transaction.hash);
  }
  return receipt;
};

const save = (filename, _variables) => {
  const variables = Object.entries(_variables)
    .map(([key, value]) => `  ${key}='${value}'`)
    .join('\n');
  fs.writeFile(filename, variables, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log(`${filename} file updated.`);
  });
};

export {sleep, sendAndWaitForTransaction, save, waitToBeMined, getDeployTransaction, addressToBytes32, waitForContractDeploy, messageSignatureForApprovals, withENS, lookupAddress, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall};
