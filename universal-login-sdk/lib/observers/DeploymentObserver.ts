import {ContractWhiteList, ensure} from '@universal-login/commons';
import {BlockchainService} from '../services/BlockchainService';
import ObserverRunner from './ObserverRunner';
import {utils} from 'ethers';

export type OnContractDeployed = (
  contractAddress: string,
  bytecode: string
 ) => void;

export class DeploymentObserver extends ObserverRunner {
  private onContractDeployed?: OnContractDeployed;
  private contractAddress?: string;

  constructor(private blockchainService: BlockchainService, private contractWhiteList: ContractWhiteList) {
    super();
  }

  startAndSubscribe(contractAddress: string, callback: OnContractDeployed) {
    ensure(!this.isRunning(), Error, 'DeploymentObserver is waiting for contract deployment. Stop observer to cancel waiting');
    this.contractAddress = contractAddress;
    this.onContractDeployed = callback;
    this.start();
    return () => {
      this.stop();
    };
  }

  async tick() {
    await this.checkContract(this.contractAddress!);
  }

  private isContractDeployed(bytecode: string) {
    return bytecode !== '0x';
  }

  private async checkContract(contractAddress: string){
    const bytecode = await this.blockchainService.getCode(contractAddress);
    if (this.isContractDeployed(bytecode)){
      ensure(this.contractWhiteList.proxy.includes(utils.keccak256(bytecode)), Error, 'Proxy Bytecode is not supported by relayer');
      await this.onContractDeployed!(contractAddress, bytecode);
      this.stop();
    }
  }
}
