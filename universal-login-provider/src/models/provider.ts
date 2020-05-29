export interface Provider {
  send: (msg: any, cb: (err: any, response: any) => void) => void;
}

export enum DialogToDisable {
  WAIT_FOR_TRANSACTION = 'WAIT_FOR_TRANSACTION',
};
