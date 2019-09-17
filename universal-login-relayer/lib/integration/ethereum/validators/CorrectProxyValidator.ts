import {Wallet, utils} from 'ethers';
import {ContractWhiteList, SignedMessage, ensure} from '@universal-login/commons';
import IMessageValidator from '../../../core/services/validators/IMessageValidator';
import {InvalidProxy} from '../../../core/utils/errors';

export default class CorrectProxyValidator implements IMessageValidator {
  constructor(private wallet: Wallet, private contractWhiteList: ContractWhiteList) {}

  async validate(signedMessage: SignedMessage) {
    const proxyByteCode = await this.wallet.provider.getCode(signedMessage.from);
    const proxyContractHash = utils.keccak256(proxyByteCode);
    ensure(
      this.contractWhiteList.proxy.includes(proxyContractHash),
      InvalidProxy,
      signedMessage.from,
      proxyContractHash,
      this.contractWhiteList.proxy);
  }
}
