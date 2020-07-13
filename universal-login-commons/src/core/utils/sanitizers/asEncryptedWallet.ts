import {asObject, asString, asNumber} from '@restless/sanitizers';
import {EncryptedWallet, WalletJSON, Crypto, CipherParams, KdfParams} from '../../models/EncryptedWallet';

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

export const asWalletJSON = asObject<WalletJSON>({
  address: asString,
  id: asString,
  version: asNumber,
  Crypto: asCrypto,
});

export const asEncryptedWallet = asObject<EncryptedWallet>({
  email: asString,
  ensName: asString,
  walletJSON: asWalletJSON,
});
