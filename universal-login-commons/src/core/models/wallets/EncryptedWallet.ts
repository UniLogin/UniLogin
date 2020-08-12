import {asObject, asString, asNumber} from '@restless/sanitizers';

interface KdfParams {
  salt: string;
  n: number;
  dklen: number;
  p: number;
  r: number;
}

interface CipherParams {
  iv: string;
}

interface Crypto {
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

const asKdfParams = asObject<KdfParams>({
  salt: asString,
  n: asNumber,
  dklen: asNumber,
  p: asNumber,
  r: asNumber,
});

const asCipherParams = asObject<CipherParams>({
  iv: asString,
});

const asCrypto = asObject<Crypto>({
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
