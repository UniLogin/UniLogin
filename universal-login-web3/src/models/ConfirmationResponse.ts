import {GasParameters} from '@unilogin/commons';

export type ConfirmationResponse = {
  isConfirmed: true;
  gasParameters: GasParameters;
} | {
  isConfirmed: false;
};
