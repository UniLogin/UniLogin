import {DeployedWallet} from '@unilogin/sdk';
import {ensureNotFalsy, GasParameters} from '@unilogin/commons';
import {State} from 'reactive-properties';

export type BackupCodesGenerationState = {
  kind: 'Initial';
} | {
  kind: 'InProgress';
  transactionHash?: string;
} | {
  kind: 'Generated';
  codes: string[];
} | {
  kind: 'Failure';
  error: string;
};

export class BackupCodesService {
  state = new State<BackupCodesGenerationState>({kind: 'Initial'});

  constructor(
    private deployedWallet: DeployedWallet,
  ) {}

  async generate(gasParameters: GasParameters | undefined) {
    try {
      this.state.set({kind: 'InProgress'});
      ensureNotFalsy(gasParameters, Error, 'Missing gas parameters');
      const {waitToBeSuccess, waitForTransactionHash} = await this.deployedWallet.generateBackupCodes(gasParameters);
      const {transactionHash} = await waitForTransactionHash();
      this.state.set({kind: 'InProgress', transactionHash});
      const codes = await waitToBeSuccess();
      this.state.set({kind: 'Generated', codes});
    } catch (e) {
      console.error(e);
      this.state.set({kind: 'Failure', error: e.message});
    }
  }
}
