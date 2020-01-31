import {GasParameters} from '@universal-login/commons';

export type ConfirmationResponse = {
  isConfirmed: true;
  gasParameters: GasParameters;
} | {
  isConfirmed: false;
};
