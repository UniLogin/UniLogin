import {utils} from 'ethers';
import {ContractWhiteList, SignedMessage, ensure, IMessageValidator, ProviderService} from '@unilogin/commons';
import {InvalidMaster} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

export default class CorrectMasterValidator implements IMessageValidator {
  constructor(private providerService: ProviderService, private contractWhiteList: ContractWhiteList, private walletContractService: WalletContractService) {}

  async validate(signedMessage: SignedMessage) {
    const master = await this.walletContractService.fetchMasterAddress(signedMessage.from);
    const masterByteCode = await this.providerService.getCode(master);
    const masterContractHash = utils.keccak256(masterByteCode);
    ensure(
      this.contractWhiteList.wallet.includes(masterContractHash),
      InvalidMaster,
      master,
      masterContractHash,
      this.contractWhiteList.wallet);
  }
}
