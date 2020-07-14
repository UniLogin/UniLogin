import {Wallet, providers} from 'ethers';
import {SignedMessage, ensure} from '@unilogin/commons';
import {NotEnoughGas} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

export default class EstimateGasValidator {
  constructor(private wallet: Wallet, private walletContractService: WalletContractService) {}

  async validate(signedMessage: SignedMessage, tokenPriceInEth: string) {
    const transactionReq: providers.TransactionRequest = await this.walletContractService.messageToTransaction(signedMessage, tokenPriceInEth);
    let messageHash;
    try {
      messageHash = await this.wallet.provider.call({...transactionReq, from: this.wallet.address}); // TODO estimate gas
    } catch (e) {
      throw new NotEnoughGas();
    }
    ensure(await this.walletContractService.isValidMessageHash(signedMessage.from, messageHash, signedMessage), NotEnoughGas);
  }
}
