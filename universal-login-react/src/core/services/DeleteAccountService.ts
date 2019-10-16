import {utils} from 'ethers';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import {DeployedWallet} from '@universal-login/sdk';

type ErrorsType = {
  usernameError: boolean;
  verifyFieldError: boolean;
};

type InputsType = {
  username: string,
  verifyField: string
};

const validateUsername = (usernameFromInput: string, usernameLogged: string): boolean =>
  usernameFromInput === usernameLogged;

export const validateVerifyField = (verifyFieldFromInput: string): boolean => {
  const verifyFieldText = 'DELETE MY ACCOUNT';
  return verifyFieldFromInput === verifyFieldText;
};

const checkInputsAgainstError = (usernameLogged: string, inputs: InputsType) => ({
  usernameError: !validateUsername(inputs.username, usernameLogged),
  verifyFieldError: !validateVerifyField(inputs.verifyField)
});

export const getInputClassName = (inputError: boolean) => inputError ? 'delete-account-input-error' : 'delete-account-input';

const doesAnyErrorExists = (errors: ErrorsType) => errors.usernameError || errors.verifyFieldError;

export const deleteAccount = async (deployedWallet: DeployedWallet, inputs: InputsType, setErrors: (errors: ErrorsType) => void, onDeleteAccountClick: () => void) => {
  const errors = checkInputsAgainstError(deployedWallet.name, inputs);
  setErrors(errors);
  if (!doesAnyErrorExists(errors)) {
    const publicKey = utils.computeAddress(deployedWallet.privateKey);
    await deployedWallet.removeKey(publicKey, transactionDetails);
    deployedWallet.sdk.stop();
    onDeleteAccountClick();
  }
};
