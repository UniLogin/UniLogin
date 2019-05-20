import {Wallet} from 'ethers';

export const createKeyPair = () : KeyPair => {
  const {address, privateKey} = Wallet.createRandom();
  return {publicKey: address, privateKey};
};

export type KeyPair = {
  publicKey: string;
  privateKey: string;
};
