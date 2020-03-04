export interface Provider {
  send: (msg: any, cb: (err: any, response: any) => void) => void;
}
