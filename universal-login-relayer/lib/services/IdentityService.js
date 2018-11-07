import Identity from 'universal-login-contracts/build/Identity';
import {hasEnoughToken, isAddKeyCall, getKeyFromData, isAddKeysCall} from '../utils/utils';
import {utils, Interface} from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';



class IdentityService {
  constructor(wallet, ensService, authorisationService, hooks, provider, counterfactualIdentityService, counterfactualTransactionsService) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
    this.counterfactualIdentityService = counterfactualIdentityService;
    this.counterfactualTransactionsService = counterfactualTransactionsService;
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    // Step 1 - create counterfactual id
    const counterfactualData = await this.counterfactualIdentityService.create(managementKey, ensName, overrideOptions);
    this.counterfactualTransactionsService.upsertData(counterfactualData.contractAddress, counterfactualData);

    return {
      address: counterfactualData.contractAddress
    };
  }

  async executeSigned(contractAddress, message) {
    if (!await this.counterfactualIdentityService.isContractDeployed(contractAddress)) {
      await this.deployCounterfactualIdentity(contractAddress);
    }

    if (await hasEnoughToken(message.gasToken, contractAddress, message.gasLimit, this.provider)) {
      const {data} = new Interface(Identity.interface).functions.executeSigned(message.to, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasLimit, message.signature);
      const transaction = {
        value: 0,
        to: contractAddress,
        data,
        ...defaultDeployOptions
      };
      const estimateGas = await this.wallet.estimateGas(transaction);
      if (message.gasLimit >= estimateGas) {
        if (message.to === contractAddress && isAddKeyCall(message.data)) {
          const key = getKeyFromData(message.data);
          await this.authorisationService.removeRequest(contractAddress, key);
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('added', sentTransaction);
          return sentTransaction;
        } else if (message.to === contractAddress && isAddKeysCall(message.data)) {
          const sentTransaction = await this.wallet.sendTransaction(transaction);
          this.hooks.emit('keysAdded', sentTransaction);
          return sentTransaction;
        }
        return await this.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }

  async deployCounterfactualIdentity(contractAddress) {
    const counterfactualData = this.counterfactualTransactionsService.getData(contractAddress);
    if (!counterfactualData) {
      throw new Error('Unknown counterfactual identity');
    }


    // Step 2 - deploy the proxy
    // Ideally this step is executed before the first meaningful execution is done
    const transaction = await this.counterfactualIdentityService.deployProxy(counterfactualData);
    await this.provider.waitForTransaction(transaction.hash);
  }
}

export default IdentityService;
