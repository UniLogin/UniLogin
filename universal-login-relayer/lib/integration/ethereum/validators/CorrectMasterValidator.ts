import {utils, Contract} from 'ethers';
import {Provider} from 'ethers/providers';
import WalletProxy from '@universal-login/contracts/build/WalletProxy.json';
import {ContractWhiteList, SignedMessage, ensure} from '@universal-login/commons';
import IMessageValidator from '../../../core/services/validators/IMessageValidator';
import {InvalidMaster} from '../../../core/utils/errors';

export default class CorrectMasterValidator implements IMessageValidator {
  constructor(private provider: Provider, private contractWhiteList: ContractWhiteList) {}

  async validate(signedMessage: SignedMessage) {
    const walletProxy = new Contract(signedMessage.from, WalletProxy.interface, this.provider);
    const master = await walletProxy.implementation();

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
