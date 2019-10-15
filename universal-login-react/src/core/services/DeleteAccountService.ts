import {utils} from 'ethers';
import {transactionDetails} from '../../core/constants/TransactionDetails';
import {DeployedWallet} from '@universal-login/sdk';

const validateUsername = (usernameInput: string, usernameLogged: string): boolean =>
  usernameInput === usernameLogged;

export const validateVerifyField = (verifyFieldInput: string): boolean => {
  const verifyFieldText = 'DELETE MY ACCOUNT';
  return verifyFieldInput === verifyFieldText;
};

export const deleteAccount = async (deployedWallet: DeployedWallet, onDeleteAccountClick: () => void, username: string, verifyFieldText: string) => {
  validateUsername(username, deployedWallet.name);
  validateVerifyField(verifyFieldText);
  const publicKey = utils.computeAddress(deployedWallet.privateKey);
  await deployedWallet.removeKey(publicKey, transactionDetails);
  deployedWallet.sdk.stop();
  onDeleteAccountClick();
};
