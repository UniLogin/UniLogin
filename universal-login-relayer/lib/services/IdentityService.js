import Identity from 'universal-login-contracts/build/Identity';
import { addressToBytes32, hasEnoughToken, isAddKeyCall, getKeyFromData } from '../utils/utils';
import ethers, { utils, Interface } from 'ethers';
import defaultDeployOptions from '../config/defaultDeployOptions';
import CounterfactualIdentityService from './CounterfactualIdentityService';



class IdentityService {
  constructor(wallet, ensService, authorisationService, hooks, provider) {
    this.wallet = wallet;
    this.abi = Identity.interface;
    this.ensService = ensService;
    this.authorisationService = authorisationService;
    this.codec = new utils.AbiCoder();
    this.hooks = hooks;
    this.provider = provider;
    this.counterfactualIdentityService = new CounterfactualIdentityService(wallet, ensService, authorisationService, hooks, provider);
  }

  async create(managementKey, ensName, overrideOptions = {}) {
    const ethersGiftToUser = utils.parseEther('1')


    // Step 1 - create counterfactual id
    const counterfactualData = await this.counterfactualIdentityService.create(managementKey, ensName, overrideOptions);

    // Step 2 - send some money to the ID address before deployment
    // Ideally this step is performed by the user himself
    const fundTransaction = await this.wallet.send(counterfactualData.counterfactualContractAddress, ethersGiftToUser);
    await this.provider.waitForTransaction(fundTransaction.hash);

    // Step 3 - deploy the proxy
    // Ideally this step is executed before the first meaningful execution is done
    const transaction = await this.counterfactualIdentityService.deployProxy(counterfactualData);
    return transaction;
  }

  async executeSigned(contractAddress, message) {
    if (await hasEnoughToken(message.gasToken, contractAddress, message.gasLimit, this.provider)) {
      const { data } = new Interface(Identity.interface).functions.executeSigned(message.to, message.value, message.data, message.nonce, message.gasToken, message.gasPrice, message.gasLimit, message.signature);
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
          this.hooks.emit('added', key);
          return sentTransaction;
        }
        return await this.wallet.sendTransaction(transaction);
      }
    }
    throw new Error('Not enough tokens');
  }
}

export default IdentityService;
