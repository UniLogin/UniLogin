import {utils} from 'ethers';
import WalletContract from '../build/Wallet.json';
import UpgradedWallet from '../build/UpgradedWallet.json';
import MockWalletMaster from '../build/MockWalletMaster.json';
import WalletProxyFactory from '../build/WalletProxyFactory.json';

export const WalletContractInterface = new utils.Interface(WalletContract.interface);
export const UpgradedWalletInterface = new utils.Interface(UpgradedWallet.interface);
export const MockWalletMasterInterface = new utils.Interface(MockWalletMaster.interface);
export const WalletProxyFactoryInterface = new utils.Interface(WalletProxyFactory.interface);
