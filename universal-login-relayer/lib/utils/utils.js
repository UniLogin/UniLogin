import ethers, {providers, utils, Interface} from 'ethers';
import ENS from 'universal-login-contracts/build/ENS';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import ERC20 from 'universal-login-contracts/build/ERC20';
import Identity from 'universal-login-contracts/build/Identity';

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
    sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return new ethers.Contract(receipt.contractAddress, abi, providerOrWallet);
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
    const token = new ethers.Contract(gasToken, ERC20.interface, provider);
    const identityTokenBalance = await token.balanceOf(identityAddress);
    return identityTokenBalance.gte(utils.bigNumberify(gasLimit));
  }
};

const lookupAddress = async (provider, address) => {
  const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
  const ens = new ethers.Contract(provider.ensAddress, ENS.interface, provider);
  const resolver = await ens.resolver(node);
  const contract = new ethers.Contract(resolver, PublicResolver.interface, provider);
  return await contract.name(node);
};

const isAddKeyCall = (data) => {
  const addKeySighash = new Interface(Identity.interface).functions.addKey.sighash;
  return addKeySighash === data.slice(0, addKeySighash.length);
};

const getKeyFromData = (data) => {
  const codec = new utils.AbiCoder();
  const addKeySighash = new Interface(Identity.interface).functions.addKey.sighash;
  const [address] = (codec.decode(['bytes32', 'uint256', 'uint256'], data.replace(addKeySighash.slice(2), '')));
  return utils.hexlify(utils.stripZeros(address));
};

const isAddKeysCall = (data) => {
  const addKeysSighash = new Interface(Identity.interface).functions.addKeys.sighash;
  return addKeysSighash === data.slice(0, addKeysSighash.length);
};

const calculateMessageHash = (msg) => {
  const dataHash = utils.solidityKeccak256(['bytes'], [msg.data]);
  return utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'bytes32', 'uint256', 'uint', 'address', 'uint', 'uint'],
    [msg.from, msg.to, msg.value, dataHash, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType]);
};

const calculateMessageSignature = (wallet, msg) => {
  const massageHash = calculateMessageHash(msg);
  return wallet.signMessage(utils.arrayify(massageHash));
};


export default calculateMessageSignature;

export {calculateMessageHash,addressToBytes32, waitForContractDeploy, messageSignatureForApprovals, withENS, lookupAddress, hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall};
