import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {ensureNotFalsy, GasParameters, ensure} from '@unilogin/commons';
import {State} from 'reactive-properties';
import {MissingParameter} from '../../core/utils/errors';

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
    private deployedWallet: DeployedWithoutEmailWallet,
  ) {}

  async generate(gasParameters: GasParameters | undefined) {
    try {
      this.state.set({kind: 'InProgress'});
      ensureNotFalsy(gasParameters, MissingParameter, 'gas parameters');
      const {waitToBeSuccess, waitForTransactionHash} = await this.deployedWallet.generateBackupCodes(gasParameters);
      const {transactionHash} = await waitForTransactionHash();
      ensure(transactionHash !== null, Error, 'transaction hash can\'t be null');
      this.state.set({kind: 'InProgress', transactionHash});
      const codes = await waitToBeSuccess();
      this.state.set({kind: 'Generated', codes});
    } catch (e) {
      console.error(e);
      this.state.set({kind: 'Failure', error: e.message});
    }
  }
}
