import {Wallet, utils} from 'ethers';
import WalletMaster from '../build/WalletMaster.json';

export const createKey = () => {
  const {address, privateKey} = Wallet.createRandom();
  return {publicKey: address, privateKey};
};

export const getInitWithENSData = (args: any[]) => new utils.Interface(WalletMaster.interface).functions.initializeWithENS.encode(args);

export const getInitData = (publicKey: string) => new utils.Interface(WalletMaster.interface).functions.initialize.encode([publicKey]);
