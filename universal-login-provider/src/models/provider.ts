export interface Provider {
  send: (msg: any, cb: (err: any, response: any) => void) => void;
}

export enum Dialogs {
  WAITING_FOR_TRANSACTION,
  ERRORS,
};
