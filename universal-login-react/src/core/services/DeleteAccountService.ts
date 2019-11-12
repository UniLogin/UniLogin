import {transactionDetails} from '../../core/constants/TransactionDetails';
import {WalletService} from '@universal-login/sdk';

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
  verifyFieldError: inputs.verifyField !== 'DISCONNECT',
});

export const getInputClassName = (inputError: boolean) => inputError ? 'disconnect-account-input-error' : 'disconnect-account-input';

const doesAnyErrorExists = (errors: ErrorsType) => errors.usernameError || errors.verifyFieldError;

export const deleteAccount = async (
  walletService: WalletService,
  inputs: InputsType,
  setErrors: (errors: ErrorsType) => void,
  onDeletionProgress: (transactionHash?: string) => void,
  onAccountDeleted: () => void,
) => {
  const errors = checkInputsAgainstError(walletService.getDeployedWallet().name, inputs);
  setErrors(errors);
  if (!doesAnyErrorExists(errors)) {
    onDeletionProgress();
    const execution = await walletService.removeWallet(transactionDetails);
    if (execution) {
      const {transactionHash} = await execution.waitForTransactionHash();
      onDeletionProgress(transactionHash);
      await execution.waitToBeSuccess();
    }
    onAccountDeleted();
  }
};
