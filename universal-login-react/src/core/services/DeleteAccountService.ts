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
  verifyFieldError: inputs.verifyField !== 'DELETE MY ACCOUNT'
});

export const getInputClassName = (inputError: boolean) => inputError ? 'delete-account-input-error' : 'delete-account-input';

const doesAnyErrorExists = (errors: ErrorsType) => errors.usernameError || errors.verifyFieldError;

export const deleteAccount = async (walletService: WalletService, inputs: InputsType, setErrors: (errors: ErrorsType) => void, onDeleteAccountClick: () => void) => {
  const errors = checkInputsAgainstError(walletService.getDeployedWallet().name, inputs);
  setErrors(errors);
  if (!doesAnyErrorExists(errors)) {
    await walletService.removeWallet(transactionDetails);
    onDeleteAccountClick();
  }
};
