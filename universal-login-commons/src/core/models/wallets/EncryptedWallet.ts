import {asObject, asString, asNumber} from '@restless/sanitizers';

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

export const asKdfParams = asObject<KdfParams>({
  salt: asString,
  n: asNumber,
  dklen: asNumber,
  p: asNumber,
  r: asNumber,
});

export const asCipherParams = asObject<CipherParams>({
  iv: asString,
});

export const asCrypto = asObject<Crypto>({
  cipher: asString,
  cipherparams: asCipherParams,
  ciphertext: asString,
  kdf: asString,
  kdfparams: asKdfParams,
  mac: asString,
});

export const asEncryptedWallet = asObject<EncryptedWallet>({
  address: asString,
  id: asString,
  version: asNumber,
  Crypto: asCrypto,
});
