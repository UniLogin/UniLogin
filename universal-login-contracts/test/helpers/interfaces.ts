import {utils} from 'ethers';
import WalletContract from '../../dist/contracts/Wallet.json';
import UpgradedWallet from '../../dist/contracts/UpgradedWallet.json';
import MockWalletMaster from '../../dist/contracts/MockWalletMaster.json';
import WalletProxyFactory from '../../dist/contracts/WalletProxyFactory.json';
import WalletProxy from '../../dist/contracts/WalletProxy.json';

export const WalletContractInterface = new utils.Interface(WalletContract.interface as any);
export const UpgradedWalletInterface = new utils.Interface(UpgradedWallet.interface as any);
export const MockWalletMasterInterface = new utils.Interface(MockWalletMaster.interface as any);
export const WalletProxyFactoryInterface = new utils.Interface(WalletProxyFactory.interface as any);
export const WalletProxyInterface = new utils.Interface(WalletProxy.interface as any);
