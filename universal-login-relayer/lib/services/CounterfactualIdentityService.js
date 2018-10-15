import Identity from 'universal-login-contracts/build/Identity';
import {addressToBytes32} from '../utils/utils';
import ethers, {utils, Wallet} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';


class CounterfactualIdentityService {
  constructor(wallet, ensService, authorisationService, hooks, provider) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
    this.deploymentValue = utils.bigNumberify(utils.parseEther('0.4'));
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    let deployTransaction = this.createDeployTransaction(managementKey, ensName);

    deployTransaction = this.setupDeployTransaction(deployTransaction, overrideOptions);

    const signedTransaction = this.signDeployTransaction(deployTransaction);

    const counterfactualTransaction = this.counterfactualizeSignedTransaction(signedTransaction);

    const fullCounterfactualData = await this.extractCounterfactualParams(counterfactualTransaction);

    this.hooks.emit('AddressGenerated', {address: fullCounterfactualData.contractAddress});

    return fullCounterfactualData;
  }

  createDeployTransaction(managementKey, ensName) {
    const key = addressToBytes32(managementKey);
    const bytecode = `0x${Identity.bytecode}`;
    const ensArgs = this.ensService.argsFor(ensName);
    const args = [key, ...ensArgs];
    return ethers.Contract.getDeployTransaction(bytecode, this.abi, ...args);
  }

  setupDeployTransaction(deployTransaction, overrideOptions) {
    const newDeployTransaction = {
      ...deployTransaction,
      ...defaultDeployOptions,
      ...overrideOptions
    };
    return newDeployTransaction;
  }

  signDeployTransaction(deployTransaction) {
    return this.wallet.sign(deployTransaction);
  }

  counterfactualizeSignedTransaction(signedTransaction) {
    const signedTransNoRSV = signedTransaction.substring(0, signedTransaction.length - 134);

    let randomS = utils.keccak256(utils.randomBytes(32));
    randomS = `0${randomS.substring(3, randomS.length)}`;

    const counterfactualMagic = `1ba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a0`;

    return `${signedTransNoRSV}${counterfactualMagic}${randomS}`;
  }

  async extractCounterfactualParams(counterfactualTransaction) {
    const parsedTrans = Wallet.parseTransaction(counterfactualTransaction);

    const {from} = parsedTrans;

    const nonce = await this.provider.getTransactionCount(deployer);

    const transaction = {
      from,
      nonce
    };

    const contractAddress = utils.getContractAddress(transaction);

    const counterfactualBalance = await this.provider.getBalance(contractAddress);
    if (utils.bigNumberify(counterfactualBalance).gt(0)) {
      throw new Error('Contract with such address has already been used');
    }

    return {
      contractAddress,
      counterfactualTransaction,
      deployer
    };
  }

  async deployProxy(fullCounterfactualData) {
    const from = fullCounterfactualData.deployer;

    const existingValue = await this.provider.getBalance(from);

    const valueToBeSent = this.deploymentValue.sub(existingValue);

    const fundTransaction = await this.wallet.send(from, valueToBeSent);
    await this.provider.waitForTransaction(fundTransaction.hash);

    const hash = await this.provider.sendTransaction(fullCounterfactualData.counterfactualTransaction);

    const deployTx = {hash};

    this.hooks.emit('Instantiated', deployTx);

    return deployTx;
  }

  async isContractDeployed(contractAddress) {
    const code = await this.provider.getCode(contractAddress);
    return (code !== '0x00');
  }
}

export default CounterfactualIdentityService;
