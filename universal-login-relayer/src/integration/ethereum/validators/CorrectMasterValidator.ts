import {utils} from 'ethers';
import {Provider} from 'ethers/providers';
import {ContractWhiteList, SignedMessage, ensure, IMessageValidator} from '@universal-login/commons';
import {InvalidMaster} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

export default class CorrectMasterValidator implements IMessageValidator {
  constructor(private provider: Provider, private contractWhiteList: ContractWhiteList, private walletContractService: WalletContractService) {}

  async validate(signedMessage: SignedMessage) {
    const master = await this.walletContractService.fetchMasterAddress(signedMessage.from);
    const masterByteCode = await this.provider.getCode(master);
    const masterContractHash = utils.keccak256(masterByteCode);
    ensure(
      this.contractWhiteList.wallet.includes(masterContractHash),
      InvalidMaster,
      master,
      masterContractHash,
      this.contractWhiteList.wallet);
  }
}
