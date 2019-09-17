import {Wallet, providers, utils} from 'ethers';
import {ContractWhiteList, SignedMessage, ensure} from '@universal-login/commons';
import {IMessageValidator} from '../../../core/services/validators/IMessageValidator';
import {ensureEnoughGas, ensureEnoughToken} from '../validations';
import {InvalidProxy} from '../../../core/utils/errors';
import {messageToTransaction} from '../../../core/utils/utils';

export class MessageValidator implements IMessageValidator {
  constructor(private wallet: Wallet, private contractWhiteList: ContractWhiteList) {
  }

  async validate(signedMessage: SignedMessage) : Promise<void> {
    await this.ensureCorrectProxy(signedMessage.from);
    await ensureEnoughToken(this.wallet.provider, signedMessage);

    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    await ensureEnoughGas(this.wallet.provider, this.wallet.address, transactionReq, signedMessage);
  }

  private async ensureCorrectProxy(from: string) {
    const proxyByteCode = await this.wallet.provider.getCode(from);
    const proxyContractHash = utils.keccak256(proxyByteCode);
    ensure(
      this.contractWhiteList.proxy.includes(proxyContractHash),
      InvalidProxy,
      from,
      proxyContractHash,
      this.contractWhiteList.proxy);
  }
}

export default MessageValidator;
