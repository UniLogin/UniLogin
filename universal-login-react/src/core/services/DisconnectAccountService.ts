import {transactionDetails} from '../constants/TransactionDetails';
import {WalletService} from '@universal-login/sdk';
import {DISCONNECT} from '../constants/verifyFields';

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
    const execution = await walletService.removeWallet(transactionDetails);
    if (execution) {
      const {transactionHash} = await execution.waitForTransactionHash();
      onDisconnectProgress(transactionHash);
      await execution.waitToBeSuccess();
    }
    onAccountDisconnected();
  }
};
