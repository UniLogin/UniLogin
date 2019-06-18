import {ContractWhiteList, ensure, isContractExist} from '@universal-login/commons';
import {BlockchainService} from '../services/BlockchainService';
import ObserverRunner from './ObserverRunner';
import {utils} from 'ethers';

export type OnContractDeployed = (
  contractAddress: string,
 ) => void;

export class DeploymentObserver extends ObserverRunner {
  private onContractDeployed?: OnContractDeployed;
  private futureContractAddress?: string;

  constructor(private blockchainService: BlockchainService, private contractWhiteList: ContractWhiteList) {
    super();
  }

  startAndSubscribe(futureContractAddress: string, callback: OnContractDeployed) {
    ensure(!this.isRunning(), Error, 'DeploymentObserver is waiting for contract deployment. Stop observer to cancel waiting');
    this.futureContractAddress = futureContractAddress;
    this.onContractDeployed = callback;
    this.start();
    return () => {
      this.stop();
    };
  }

  async tick() {
    await this.checkContract(this.futureContractAddress!);
  }

  private async checkContract(futureContractAddress: string){
    const bytecode = await this.blockchainService.getCode(futureContractAddress);
    if (isContractExist(bytecode)){
      ensure(this.contractWhiteList.proxy.includes(utils.keccak256(bytecode)), Error, 'Proxy Bytecode is not supported by relayer');
      await this.onContractDeployed!(futureContractAddress);
      this.stop();
    }
  }
}
