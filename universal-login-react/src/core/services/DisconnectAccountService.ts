import {WalletService} from '@unilogin/sdk';
import {DEFAULT_GAS_PRICE, ensureNotFalsy} from '@unilogin/commons';
import {DISCONNECT} from '../constants/verifyFields';
import {MissingParameter} from '../../core/utils/errors';

interface ErrorsType {
  usernameError: boolean;
  verifyFieldError: boolean;
}

interface InputsType {
  username: string;
  verifyField: string;
}

const checkInputsAgainstError = (usernameLogged: string, inputs: InputsType) => ({
  usernameError: inputs.username !== usernameLogged,
  verifyFieldError: inputs.verifyField !== DISCONNECT,
});

export const getInputClassName = (inputError: boolean) => inputError ? 'disconnect-account-input-error' : 'disconnect-account-input';

const doesAnyErrorExists = (errors: ErrorsType) => errors.usernameError || errors.verifyFieldError;

export const disconnectAccount = async (
  walletService: WalletService,
  inputs: InputsType,
  setErrors: (errors: ErrorsType) => void,
  onDisconnectProgress: (transactionHash?: string) => void,
  onAccountDisconnected: () => void,
) => {
  const errors = checkInputsAgainstError(walletService.getDeployedWallet().name, inputs);
  setErrors(errors);
  if (!doesAnyErrorExists(errors)) {
    onDisconnectProgress();
    const execution = await walletService.removeWallet({gasPrice: DEFAULT_GAS_PRICE});
    if (execution) {
      const {transactionHash} = await execution.waitForTransactionHash();
      ensureNotFalsy(transactionHash, MissingParameter, 'transaction hash');
      onDisconnectProgress(transactionHash);
      await execution.waitToBeSuccess();
    }
    onAccountDisconnected();
  }
};
