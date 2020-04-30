import {Wallet, providers} from 'ethers';
import {SignedMessage, ensure, IMessageValidator} from '@unilogin/commons';
import {NotEnoughGas} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

export default class EstimateGasValidator implements IMessageValidator {
  constructor(private wallet: Wallet, private walletContractService: WalletContractService) {}

  async validate(signedMessage: SignedMessage) {
    const transactionReq: providers.TransactionRequest = await this.walletContractService.messageToTransaction(signedMessage);
    let messageHash;
    try {
      messageHash = await this.wallet.provider.call({...transactionReq, from: this.wallet.address}); // TODO estimate gas
    } catch (e) {
      throw new NotEnoughGas();
    }
    ensure(await this.walletContractService.isValidMessageHash(signedMessage.from, messageHash, signedMessage), NotEnoughGas);
  }
}
