import Identity from 'universal-login-contracts/build/Identity';
import { addressToBytes32 } from '../utils/utils';
import ethers, { utils, Wallet } from 'ethers';
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
    this.minimumWeiInContractBeforeDeploy = utils.parseEther('0');
    this.deploymentValue = utils.bigNumberify(utils.parseEther('0.4'));
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    let deployTransaction = this._createDeployTransaction(managementKey, ensName);

    deployTransaction = this._setupDeployTransaction(deployTransaction, overrideOptions);

    const signedTransaction = this._signDeployTransaction(deployTransaction);

    const counterfactualTransaction = this._counterfactualizeSignedTransaction(signedTransaction);

    const fullCounterfactualData = await this._extractCounterfactualParams(counterfactualTransaction);

    this.hooks.emit('counterfactuallyCreated', fullCounterfactualData);

    return fullCounterfactualData;
  }

  _createDeployTransaction(managementKey, ensName) {
    const key = addressToBytes32(managementKey);
    const bytecode = `0x${Identity.bytecode}`;
    const ensArgs = this.ensService.argsFor(ensName);
    const args = [key, ...ensArgs];
    return ethers.Contract.getDeployTransaction(bytecode, this.abi, ...args);
  }

  _setupDeployTransaction(deployTransaction, overrideOptions) {
    const newDeployTransaction = {
      ...deployTransaction,
      ...defaultDeployOptions,
      ...overrideOptions
    };
    return newDeployTransaction;
  }

  _signDeployTransaction(deployTransaction) {
    return this.wallet.sign(deployTransaction);
  }

  _counterfactualizeSignedTransaction(signedTransaction) {
    const signedTransNoRSV = signedTransaction.substring(0, signedTransaction.length - 134);

    let randomS = utils.keccak256(utils.randomBytes(3));
    randomS = '0' + randomS.substring(3, randomS.length);

    const counterfactualMagic = `1ba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a0`;

    return `${signedTransNoRSV}${counterfactualMagic}${randomS}`;
  }

  async _extractCounterfactualParams(counterfactualTransaction) {
    const parsedTrans = Wallet.parseTransaction(counterfactualTransaction);

    const counterfactualDeploymentPayer = parsedTrans.from;

    let nonce = await this.provider.getTransactionCount(counterfactualDeploymentPayer);

    const transaction = {
      from: counterfactualDeploymentPayer,
      nonce: nonce
    };

    const counterfactualContractAddress = utils.getContractAddress(transaction);

    let counterfactualBalance = await this.provider.getBalance(counterfactualContractAddress);
    if (utils.bigNumberify(counterfactualBalance).gt(0)) {
      throw new Error("Contract with such address has already been used")
    }

    return {
      counterfactualContractAddress,
      counterfactualTransaction,
      counterfactualDeploymentPayer
    }
  }

  async deployProxy(fullCounterfactualData) {

    const counterfactualBalance = await this.provider.getBalance(fullCounterfactualData.counterfactualContractAddress);

    if (utils.bigNumberify(counterfactualBalance).lt(this.minimumWeiInContractBeforeDeploy)) {
      throw new Error("Counterfactual contract should have ethers")
    }

    const from = fullCounterfactualData.counterfactualDeploymentPayer;

    const existingValue = await this.provider.getBalance(from);

    const valueToBeSent = this.deploymentValue.sub(existingValue);

    const fundTransaction = await this.wallet.send(from, valueToBeSent);
    await this.provider.waitForTransaction(fundTransaction.hash);

    const hash = await this.provider.sendTransaction(fullCounterfactualData.counterfactualTransaction);

    const deployTx = { hash }

    this.hooks.emit('created', deployTx);

    return deployTx
  }

  async isContractDeployed(contractAddress) {
    let code = await this.provider.getCode(contractAddress);
    return (code !== '0x');
  }

}

export default CounterfactualIdentityService;
