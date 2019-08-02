import {utils, Wallet} from 'ethers';
import scrypt from 'scrypt-js';

export function walletFromBrain(
  username: string | utils.Arrayish | utils.Hexable,
  password: string | utils.Arrayish | utils.Hexable
): Promise<Wallet> {
  let usernameUtf8Bytes: Uint8Array;
  let passwordUtf8Bytes: Uint8Array;

  if (typeof(username) === 'string') {
    usernameUtf8Bytes =  utils.toUtf8Bytes(username, utils.UnicodeNormalizationForm.NFKC);
  } else {
    usernameUtf8Bytes = utils.arrayify(username);
  }

  if (typeof(password) === 'string') {
    passwordUtf8Bytes =  utils.toUtf8Bytes(password, utils.UnicodeNormalizationForm.NFKC);
  } else {
      passwordUtf8Bytes = utils.arrayify(password);
  }

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
        key?: ReadonlyArray<number>
      ) {
        if (error) {
          reject(error);

        } else if (key) {
          resolve(new Wallet(utils.hexlify(key)));
        }
    });
  });
}
