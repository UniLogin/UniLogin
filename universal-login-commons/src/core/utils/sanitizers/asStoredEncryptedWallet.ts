import {asObject, asString, asNumber} from '@restless/sanitizers';
import {StoredEncryptedWallet, EncryptedWallet, Crypto, CipherParams, KdfParams} from '../../models/wallets/StoredEncryptedWallet';

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

export const asStoredEncryptedWallet = asObject<StoredEncryptedWallet>({
  email: asString,
  ensName: asString,
  walletJSON: asEncryptedWallet,
});
