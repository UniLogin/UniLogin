import {Wallet, utils, Contract} from 'ethers';
import WalletProxy from '@universal-login/contracts/build/WalletProxy.json';
import {ContractWhiteList, SignedMessage, ensure} from '@universal-login/commons';
import IMessageValidator from '../../../core/services/validators/IMessageValidator';
import {InvalidMaster} from '../../../core/utils/errors';

export default class CorrectMasterValidator implements IMessageValidator {
  constructor(private wallet: Wallet, private contractWhiteList: ContractWhiteList) {}

  async validate(signedMessage: SignedMessage) {
    const walletProxy = new Contract(signedMessage.from, WalletProxy.interface, this.wallet.provider);
    const master = await walletProxy.implementation();

    const masterByteCode = await this.wallet.provider.getCode(master);
    const masterContractHash = utils.keccak256(masterByteCode);

    ensure(
      this.contractWhiteList.wallet.includes(masterContractHash),
      InvalidMaster,
      master,
      masterContractHash,
      this.contractWhiteList.wallet);
  }
}
