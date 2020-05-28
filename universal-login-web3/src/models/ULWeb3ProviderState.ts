import {ConfirmationResponse} from './ConfirmationResponse';
import {Message, PartialRequired} from '@unilogin/commons';

export type ULWeb3ProviderState = {
  kind: 'IDLE';
} | {
  kind: 'ONBOARDING';
} | {
  kind: 'TRANSACTION_CONFIRMATION';
  props: {
    onConfirmationResponse: (response: ConfirmationResponse) => void;
    title: string;
    transaction: PartialRequired<Message, 'to' | 'from' | 'gasLimit' | 'value'>;
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
} | {
  kind: 'ERROR';
  props: {
    errorMessage?: string;
  };
} | {
  kind: 'WARNING_LOCAL_STORAGE';
};
