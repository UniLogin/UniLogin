import {ConfirmationResponse} from './ConfirmationResponse';
import {Message} from '@universal-login/commons';

export type ULWeb3ProviderState = {
  kind: 'IDLE';
} | {
  kind: 'ONBOARDING';
} | {
  kind: 'TRANSACTION_CONFIRMATION';
  props: {
    onConfirmationResponse: (response: ConfirmationResponse) => void;
    title: string;
    transaction: Partial<Message>;
  };
} | {
  kind: 'SIGN_CONFIRMATION';
  props: {
    onConfirmationResponse: (value: boolean) => void;
    title: string;
    signMessage: string;
  };
} | {
  kind: 'WAIT_FOR_TRANSACTION';
  props: {
    transactionHash?: string;
  };
};
