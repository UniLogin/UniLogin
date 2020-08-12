export interface KdfParams {
  salt: string;
  n: number;
  dklen: number;
  p: number;
  r: number;
}

export interface CipherParams {
  iv: string;
}

export interface Crypto {
  cipher: string;
  cipherparams: CipherParams;
  ciphertext: string;
  kdf: string;
  kdfparams: KdfParams;
  mac: string;
}

export interface EncryptedWallet {
  address: string;
  id: string;
  version: number;
  Crypto: Crypto;
}
