import {Wallet} from 'ethers';
import {KeyPair} from '../models/keyPair';

export const createKeyPair = (): KeyPair => {
  const {address, privateKey} = Wallet.createRandom();
  return {publicKey: address, privateKey};
};
