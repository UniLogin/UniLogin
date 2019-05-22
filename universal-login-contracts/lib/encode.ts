import {utils} from 'ethers';
import WalletMaster from '../build/WalletMaster.json';

export const encodeInitializeWithENSData = (args: string[]) => new utils.Interface(WalletMaster.interface).functions.initializeWithENS.encode(args);

export const encodeInitializeData = (publicKey: string) => new utils.Interface(WalletMaster.interface).functions.initialize.encode([publicKey]);
