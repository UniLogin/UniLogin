import {utils, Wallet} from 'ethers';
import scrypt from 'scrypt-js';

export function walletFromBrain(username: string, password: string): Promise<Wallet> {
  const usernameUtf8Bytes =  utils.toUtf8Bytes(username, utils.UnicodeNormalizationForm.NFKC);
  const passwordUtf8Bytes =  utils.toUtf8Bytes(password, utils.UnicodeNormalizationForm.NFKC);

  return new Promise(function (resolve, reject) {
    scrypt(
      passwordUtf8Bytes,
      usernameUtf8Bytes,
      (1 << 18),
      8,
      1,
      32,
      function (
        error: Error | null | undefined,
        progress: number,
        key?: any
      ) {
        if (error) {
          reject(error);

        } else if (key) {
          resolve(new Wallet(utils.hexlify(key)));
        }
    });
  });
}
