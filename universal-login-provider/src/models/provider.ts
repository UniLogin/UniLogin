export interface Provider {
  send: (msg: any, cb: (err: any, response: any) => void) => void;
}

export enum DialogToDisable {
  WAITING_FOR_TRANSACTION = 'WAITING_FOR_TRANSACTION',
};
