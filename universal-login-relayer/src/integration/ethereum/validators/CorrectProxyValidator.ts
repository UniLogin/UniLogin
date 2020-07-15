import {utils} from 'ethers';
import {ContractWhiteList, SignedMessage, ensure, IMessageValidator, ProviderService} from '@unilogin/commons';
import {InvalidProxy} from '../../../core/utils/errors';

export default class CorrectProxyValidator implements IMessageValidator {
  constructor(private providerService: ProviderService, private contractWhiteList: ContractWhiteList) {}

  async validate(signedMessage: SignedMessage) {
    const proxyByteCode = await this.providerService.getCode(signedMessage.from);
    const proxyContractHash = utils.keccak256(proxyByteCode);
    ensure(
      this.contractWhiteList.proxy.includes(proxyContractHash),
      InvalidProxy,
      signedMessage.from,
      proxyContractHash,
      this.contractWhiteList.proxy);
  }
}
